import {Bash} from 'just-bash/browser';
export const HOME='/home/ogrenci';
export const quote=s=>"'"+String(s).replaceAll("'","'\\''")+"'";
const limits={maxExecutionTimeMs:5000,maxLoopIterations:20000,maxCommandCount:30000,maxOutputSize:200000,maxFileSystemBytes:8*1024*1024,maxCallDepth:80};
export function newShell(options={}){return new Bash({cwd:HOME,env:{HOME,USER:'ogrenci',LC_ALL:'C'},executionLimits:limits,...options});}
export async function snapshot(shell,root='/home'){
  const paths=shell.fs.getAllPaths().filter(p=>(root==='/'||p===root||p.startsWith(root+'/'))&&!p.startsWith('/tmp/.bil214')).sort();
  if(paths.length>3000)throw Error('Dosya sayısı sınırı aşıldı (3000).');
  const result=[];let bytes=0;
  for(const path of paths){
    const s=await shell.fs.lstat(path);
    const e={path,type:s.isSymbolicLink?'symlink':s.isDirectory?'directory':'file',mode:s.mode};
    if(e.type==='file'){e.content=await shell.fs.readFile(path);bytes+=e.content.length;}
    if(e.type==='symlink')e.target=await shell.fs.readlink(path);
    if(bytes>6*1024*1024)throw Error('Çalışma alanı kayıt sınırı aşıldı (6 MB).');
    result.push(e);
  }
  return result;
}
export async function restore(entries,options={}){
  const shell=newShell(options);
  for(const e of entries.filter(e=>e.type==='directory').sort((a,b)=>a.path.length-b.path.length))await shell.fs.mkdir(e.path,{recursive:true});
  for(const e of entries.filter(e=>e.type!=='directory')){
    await shell.fs.mkdir(e.path.slice(0,e.path.lastIndexOf('/'))||'/',{recursive:true});
    if(e.type==='symlink'){if(await shell.fs.exists(e.path))await shell.fs.rm(e.path,{force:true});await shell.fs.symlink(e.target,e.path);}
    else await shell.fs.writeFile(e.path,e.content||'');
  }
  for(const e of entries)if(e.mode!==undefined&&e.type!=='symlink')await shell.fs.chmod(e.path,e.mode);
  return shell;
}
export async function runScript(shell,code,test={}){
  await shell.fs.mkdir('/tmp',{recursive:true});
  await shell.fs.writeFile('/tmp/.bil214-solution.sh',code.replace(/\r\n/g,'\n'));
  return shell.exec('bash /tmp/.bil214-solution.sh '+(test.args||[]).map(quote).join(' '),{cwd:test.cwd||HOME,env:test.env||{},stdin:test.stdin||''});
}
export {normalize,checkResult} from './grading.js';
