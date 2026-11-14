// Test the same WebAssembly worker without network or a browser process.
import {parentPort} from 'node:worker_threads';
import {readFileSync} from 'node:fs';
import {fileURLToPath,pathToFileURL} from 'node:url';
import vm from 'node:vm';
const root=fileURLToPath(new URL('../',import.meta.url));
const context=vm.createContext({WebAssembly,TextEncoder,TextDecoder,Uint8Array,Uint32Array,ArrayBuffer,URL,Date,Map,BigInt,console,performance,setTimeout,
  self:{location:{href:pathToFileURL(root+'src/c-worker.js').href},postMessage:data=>parentPort.postMessage(data)},
  fetch:async resource=>{
    const u=new URL(resource);const file=fileURLToPath(u);
    if(!file.startsWith(root+'vendor'))throw Error('Test fetch outside vendor');
    const b=readFileSync(file);return {ok:true,arrayBuffer:async()=>b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength)};
  }
});
context.importScripts=()=>vm.runInContext(readFileSync(root+'vendor/clang/shared.js','utf8'),context);
vm.runInContext(readFileSync(root+'src/c-worker.js','utf8'),context);
parentPort.on('message',async data=>{try{await context.self.onmessage({data});}catch(e){parentPort.postMessage({id:data.id,error:e.message});}});
