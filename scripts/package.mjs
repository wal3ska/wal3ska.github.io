import {mkdir,cp,readFile,writeFile,stat,readdir,open,rename} from 'node:fs/promises';
import path from 'node:path';
import {deflateRawSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const material=JSON.parse(await readFile('data/materials.json','utf8'));
await stat('dist/index.html');
await mkdir('output/site/bil214',{recursive:true});
await cp('dist','output/site/bil214',{recursive:true});
await mkdir('output/source/bil214-source',{recursive:true});
const sources=[
  '.github','.gitignore','.gitattributes','README.md','DESIGN.md','THIRD_PARTY_NOTICES.md',
  'package.json','package-lock.json','index.html','styles.css','favicon.svg','sw.js',
  'src','content','vendor','tests','scripts',
  'data/materials.json','data/questions.json',
  ...material.documents.map(x=>x.path),...material.examples.map(x=>x.path)
];
for(const name of sources){
  const target=`output/source/bil214-source/${name}`;
  await mkdir(target.slice(0,target.lastIndexOf('/')),{recursive:true});
  await cp(name,target,{recursive:true});
}
// Portable ZIP writer: UTF-8 names, deflate, CRC32. No external archive tool.
const crcTable=Uint32Array.from({length:256},(_,i)=>{for(let k=0;k<8;k++)i=i&1?0xedb88320^(i>>>1):i>>>1;return i>>>0;});
function crc32(data){let crc=0xffffffff;for(const b of data)crc=crcTable[(crc^b)&255]^(crc>>>8);return (crc^0xffffffff)>>>0;}
async function walk(root,prefix=''){
  const names=[];
  for(const entry of (await readdir(path.join(root,prefix),{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name))){
    const name=prefix+entry.name;
    if(entry.isDirectory())names.push(...await walk(root,name+'/'));
    else if(entry.isFile())names.push(name);
  }
  return names;
}
async function zip(root,target){
  const names=await walk(root),temporary=target+'.tmp',file=await open(temporary,'w');
  const central=[];let offset=0;
  try{
    for(const name of names){
      const nameBytes=Buffer.from(name),data=await readFile(path.join(root,name)),compressed=deflateRawSync(data,{level:6}),crc=crc32(data);
      const header=Buffer.alloc(30);header.writeUInt32LE(0x04034b50);header.writeUInt16LE(20,4);header.writeUInt16LE(0x800,6);header.writeUInt16LE(8,8);header.writeUInt16LE(0x5c21,12);header.writeUInt32LE(crc,14);header.writeUInt32LE(compressed.length,18);header.writeUInt32LE(data.length,22);header.writeUInt16LE(nameBytes.length,26);
      const record=Buffer.alloc(46);record.writeUInt32LE(0x02014b50);record.writeUInt16LE(20,4);record.writeUInt16LE(20,6);record.writeUInt16LE(0x800,8);record.writeUInt16LE(8,10);record.writeUInt16LE(0x5c21,14);record.writeUInt32LE(crc,16);record.writeUInt32LE(compressed.length,20);record.writeUInt32LE(data.length,24);record.writeUInt16LE(nameBytes.length,28);record.writeUInt32LE(offset,42);
      for(const bytes of [header,nameBytes,compressed])await file.writeFile(bytes);
      central.push(record,nameBytes);offset+=header.length+nameBytes.length+compressed.length;
    }
    const directory=Buffer.concat(central),end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50);end.writeUInt16LE(names.length,8);end.writeUInt16LE(names.length,10);end.writeUInt32LE(directory.length,12);end.writeUInt32LE(offset,16);
    await file.writeFile(directory);await file.writeFile(end);
  }finally{await file.close();}
  await rename(temporary,target);
}
for(const [name,directory]of [['bil214-pages.zip','site'],['bil214-source.zip','source']]){
  await zip(`output/${directory}`,`output/${name}`);
  const bytes=await readFile(`output/${name}`);
  const digest=createHash('sha256').update(bytes).digest('hex');
  await writeFile(`output/${name}.sha256`,`${digest}  ${name}\n`);
  console.log(`${name}: ${(bytes.length/1024/1024).toFixed(1)} MiB, SHA256 ${digest}`);
}
