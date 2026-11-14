import {newShell,restore,snapshot,runScript,HOME} from './shell-core.mjs';
let shell, cwd=HOME, env={}, declarations='', functions={},lastExit=0;
function attachFunctions(){
  shell.registerTransformPlugin({name:'bil214-session-functions',transform({ast}){
    const saved=Object.values(functions);
    for(const s of ast.statements||[])for(const p of s.pipelines||[])for(const c of p.commands||[]){
      if(c.type==='FunctionDef')functions[c.name]=structuredClone(s);
    }
    return {ast:{...ast,statements:[...saved,...ast.statements]}};
  }});
}
async function state(){return {entries:await snapshot(shell,'/'),cwd,env,declarations,functions,lastExit};}
self.onmessage=async({data})=>{
  const {id,type}=data;
  try{
    if(type==='init'){
      const s=data.state;
      cwd=s?.cwd||HOME;env=s?.env||{HOME,USER:'ogrenci',LC_ALL:'C'};
      declarations=s?.declarations||'';functions=s?.functions||{};lastExit=s?.lastExit||0;
      shell=s?.entries?await restore(s.entries,{cwd,env}):newShell({cwd,env,files:data.files||{}});
      if(!await shell.fs.exists(cwd)){cwd=HOME;await shell.fs.mkdir(cwd,{recursive:true});}
      attachFunctions();self.postMessage({id,...await state()});
    }else if(type==='terminal'){
      const script=declarations+'\n(exit '+lastExit+')\n'+data.code+'\n__bil214_status=$?\npwd > /tmp/.bil214-cwd\ndeclare -p > /tmp/.bil214-vars\necho $__bil214_status > /tmp/.bil214-status';
      await shell.fs.mkdir('/tmp',{recursive:true});
      for(const path of ['/tmp/.bil214-vars','/tmp/.bil214-cwd','/tmp/.bil214-status'])await shell.fs.rm(path,{force:true});
      const r=await shell.exec(script,{cwd,env,stdin:data.stdin||'',rawScript:true});
      if(await shell.fs.exists('/tmp/.bil214-cwd'))cwd=(await shell.fs.readFile('/tmp/.bil214-cwd')).trim();
      env=r.env||env;env.PWD=cwd;
      if(await shell.fs.exists('/tmp/.bil214-status'))r.exitCode=Number((await shell.fs.readFile('/tmp/.bil214-status')).trim());
      lastExit=r.exitCode;
      if(await shell.fs.exists('/tmp/.bil214-vars')){
        const s=await shell.fs.readFile('/tmp/.bil214-vars');
        declarations=s.split(/\n(?=declare )/).filter(x=>!/^declare -[^ ]*r/.test(x)&&!/^declare \S+ (\?|PIPESTATUS|PWD|OLDPWD|__bil214\w*)=/.test(x)).join('\n');
      }
      self.postMessage({id,...r,...await state()});
    }else if(type==='script'){
      const r=await runScript(shell,data.code,{cwd,env,args:data.args,stdin:data.stdin});
      self.postMessage({id,...r,...await state()});
    }else if(type==='write'){
      const path=shell.fs.resolvePath(cwd,data.path);
      if(data.createOnly&&await shell.fs.exists(path))throw Error('Bu konumda zaten bir dosya veya klasör var.');
      await shell.fs.mkdir(path.slice(0,path.lastIndexOf('/'))||'/',{recursive:true});
      await shell.fs.writeFile(path,data.content);
      self.postMessage({id,path,...await state()});
    }else if(type==='grade'||type==='questionRun'){
      const results=[];
      for(const t of data.tests){
        self.postMessage({type:'progress',message:`Bash testi ${results.length+1}/${data.tests.length}`});
        const b=await restore(t.before||[],{cwd:t.cwd||HOME,env:t.env||{HOME}});
        const r=await runScript(b,data.code,t);
        results.push({stdout:r.stdout,stderr:r.stderr,exitCode:r.exitCode,entries:await snapshot(b)});
      }
      self.postMessage({id,results});
    }else throw Error('Bilinmeyen işlem');
  }catch(e){self.postMessage({id,error:e.message});}
};
