// Optional recovery tool. Normal builds use the checked-in, pinned runtime.
import {mkdir,writeFile,readFile} from 'node:fs/promises';
const version=JSON.parse(await readFile('vendor/clang/version.json','utf8'));
await mkdir('vendor/clang',{recursive:true});
for(const name of ['clang','lld','memfs','sysroot.tar','shared.js','LICENSE','LICENSE.llvm']){
  const response=await fetch(`https://raw.githubusercontent.com/binji/wasm-clang/${version.commit}/${name}`);
  if(!response.ok)throw Error(`${response.status}: ${name}`);
  let data=new Uint8Array(await response.arrayBuffer());
  if(name==='shared.js'){
    let source=new TextDecoder().decode(data);
    if(!source.includes('this.hostWrite(str);')||!source.includes('return API;'))throw Error('Runtime adapter patch does not match this revision.');
    source=source.replace('this.hostWrite(str);','this.hostWrite(str, fd);')
      .replace('return API;','// BIL214 adapter: expose execution and exit primitives.\nAPI.App = App;\nAPI.ProcExit = ProcExit;\nreturn API;');
    data=new TextEncoder().encode(source);
  }
  await writeFile(`vendor/clang/${name}`,data);
  console.log(`${name}: ${data.length} bytes`);
}
