/* Real Clang/LLD compilation in a disposable worker. No server execution. */
importScripts('../vendor/clang/shared.js');
const buffers=new Map(), modules=new Map();
let phase='loading', stdout='', stderr='';
const MAX_OUTPUT=200000;
async function readBuffer(name){
  if(!buffers.has(name)) buffers.set(name,(async()=>{
    const r=await fetch(new URL('../vendor/clang/'+name,self.location.href));
    if(!r.ok) throw Error('Derleyici dosyası yüklenemedi: '+name+' ('+r.status+')');
    return r.arrayBuffer();
  })());
  return buffers.get(name);
}
async function compileStreaming(name){
  if(!modules.has(name)) modules.set(name,readBuffer(name).then(b=>WebAssembly.compile(b)));
  return modules.get(name);
}
function capture(s,fd=1){
  if(phase==='running'&&fd===1) stdout+=s; else stderr+=s;
  if(stdout.length+stderr.length>MAX_OUTPUT) throw Error('Çıktı sınırı aşıldı (200 KB).');
}
function report(message){self.postMessage({type:'progress',message});}
function clean(s){return s.replace(/\x1b\[[0-9;]*m/g,'');}
function utf8(s){return new TextEncoder().encode(s);}
function decode(s){return new TextDecoder().decode(Uint8Array.from(s,c=>c.charCodeAt(0)));}
API.App.prototype.clock_time_get=function(clock,precision,out){
  this.mem.check(); const ns=BigInt(Date.now())*1000000n;
  this.mem.write64(out,Number(ns&0xffffffffn),Number(ns>>32n)); return 0;
};
self.onmessage=async({data})=>{
  const {id,code,tests=[{stdin:'',args:[]}],files={}}=data;
  stdout='';stderr='';phase='loading';
  try{
    report('C derleyicisi hazırlanıyor… İlk açılışta yaklaşık 60 MB yüklenir.');
    const api=new API({readBuffer,compileStreaming,hostWrite:capture});
    api.hostLog=()=>{};
    api.hostLogAsync=async(_,p)=>p;
    await api.ready;
    for(const [path,content] of Object.entries(files)){
      const parts=path.replace(/^\//,'').split('/');
      for(let i=1;i<parts.length;i++){try{api.memfs.addDirectory(parts.slice(0,i).join('/'));}catch{}}
      api.memfs.addFile(path.replace(/^\//,''),utf8(content));
    }
    const run=async(module,...args)=>{
      const app=new API.App(module,api.memfs,...args); await app.ready;
      try{app.exports._start();return 0;}catch(e){if(e instanceof API.ProcExit)return e.code;throw e;}
    };
    phase='compile';report('C kodu derleniyor…');
    api.memfs.addFile('main.c',utf8(code));
    const clang=await compileStreaming('clang');
    const compileExit=await run(clang,'clang','-cc1','-emit-obj','-isysroot','/',
      '-internal-isystem','/include','-internal-isystem','/lib/clang/8.0.1/include',
      '-std=c11','-Wno-main-return-type','-ferror-limit','6','-O0','-o','main.o','-x','c','main.c');
    if(compileExit!==0){self.postMessage({id,type:'result',compileError:true,stderr:decode(clean(stderr)),exitCode:compileExit});return;}
    const lld=await compileStreaming('lld');
    const linkExit=await run(lld,'wasm-ld','--no-threads','-z','stack-size=1048576','-Llib/wasm32-wasi',
      'lib/wasm32-wasi/crt1.o','main.o','-lc','-o','main.wasm');
    if(linkExit!==0){self.postMessage({id,type:'result',compileError:true,stderr:decode(clean(stderr)),exitCode:linkExit});return;}
    const warnings=decode(clean(stderr));
    const program=await WebAssembly.compile(api.memfs.getFileContents('main.wasm'));
    const results=[];
    for(let i=0;i<tests.length;i++){
      report(`Çalıştırılıyor: ${i+1}/${tests.length}`);
      phase='running';stdout='';stderr='';
      // Each test gets a new WASI filesystem and a new WASM instance.
      const runtime=new API({readBuffer,compileStreaming,hostWrite:capture});
      runtime.hostLog=()=>{};runtime.hostLogAsync=async(_,p)=>p;await runtime.ready;
      runtime.memfs.setStdinStr(String.fromCharCode(...utf8(tests[i].stdin||'')));
      for(const [p,c] of Object.entries(files)){
        const parts=p.replace(/^\//,'').split('/');
        for(let j=1;j<parts.length;j++){try{runtime.memfs.addDirectory(parts.slice(0,j).join('/'));}catch{}}
        runtime.memfs.addFile(p.replace(/^\//,''),utf8(c));
      }
      const app=new API.App(program,runtime.memfs,'./main',...(tests[i].args||[]));await app.ready;
      let exitCode=0;
      try{app.exports._start();}catch(e){
        if(e instanceof API.ProcExit)exitCode=e.code;
        else {exitCode=1;stderr+='\n'+e.message;}
      }
      results.push({stdout:decode(stdout),stderr:decode(clean(stderr)),exitCode});
    }
    self.postMessage({id,type:'result',results,warnings});
  }catch(e){self.postMessage({id,type:'result',error:e.message,stderr:decode(clean(stderr))});}
};
