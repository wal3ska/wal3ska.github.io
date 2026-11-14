// Optional resolver for restricted Windows workspaces: all dependency reads
// stay inside this checkout instead of scanning inaccessible parent folders.
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
export function workspaceResolver(root){
  const contains=p=>p===root||p.startsWith(root+path.sep);
  function condition(value){if(typeof value==='string')return value;if(Array.isArray(value))return condition(value[0]);if(value&&typeof value==='object')for(const k of ['browser','import','default','require'])if(value[k])return condition(value[k]);return null;}
  async function file(candidate){
    for(const p of [candidate,candidate+'.js',candidate+'.mjs',candidate+'.cjs',path.join(candidate,'index.js')]){
      if(!contains(p))throw Error('Dependency outside workspace: '+p);
      try{if((await stat(p)).isFile())return p;}catch{}
    }
    throw Error('Module not found inside workspace: '+candidate);
  }
  return {name:'workspace-only-resolution',setup(build){
    build.onResolve({filter:/.*/},async args=>{
      if(args.path==='node:zlib')return {path:path.join(root,'src/zlib-shim.js'),namespace:'workspace'};
      if(args.path.startsWith('node:')||['@mongodb-js/zstd','node-liblzma','seek-bzip'].includes(args.path))return {path:args.path,external:true};
      if(args.kind==='entry-point'||args.path.startsWith('.')||path.isAbsolute(args.path))return {path:await file(path.resolve(args.resolveDir||root,args.path)),namespace:'workspace'};
      const parts=args.path.split('/'),name=parts.splice(0,args.path.startsWith('@')?2:1).join('/');
      const dir=path.join(root,'node_modules',name),pkg=JSON.parse(await readFile(path.join(dir,'package.json'),'utf8'));
      const sub=parts.length?'./'+parts.join('/') :'.';let target;
      if(pkg.exports){
        const map=pkg.exports;
        if(typeof map==='string'||!Object.keys(map).some(k=>k.startsWith('.')))target=sub==='.'?condition(map):null;
        else {target=condition(map[sub]);if(!target)for(const [k,v] of Object.entries(map)){if(k.includes('*')){const[a,b]=k.split('*');if(sub.startsWith(a)&&sub.endsWith(b)){const match=sub.slice(a.length,b?-b.length:undefined);target=condition(v)?.replace('*',match);break;}}}}
      }
      target??=parts.length?parts.join('/'):pkg.module||pkg.main||'index.js';
      return {path:await file(path.resolve(dir,target)),namespace:'workspace'};
    });
    build.onLoad({filter:/.*/,namespace:'workspace'},async args=>({contents:await readFile(args.path,'utf8'),loader:args.path.endsWith('.json')?'json':'js',resolveDir:path.dirname(args.path)}));
  }};
}
