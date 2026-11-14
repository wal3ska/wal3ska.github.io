import {readFile,readdir,writeFile} from 'node:fs/promises';
const lock=JSON.parse(await readFile('package-lock.json','utf8'));
const sections=['BIL214 — Third-party npm licenses\nGenerated from package-lock.json. Includes production dependencies.\nCompiler licenses are in vendor/clang/LICENSE and vendor/clang/LICENSE.llvm.'];
for(const [directory,info]of Object.entries(lock.packages)){
  if(!directory||info.dev)continue;
  let pkg;
  try{pkg=JSON.parse(await readFile(`${directory}/package.json`,'utf8'));}
  catch(e){if(e.code==='ENOENT'&&info.optional)continue;throw e;}
  const names=(await readdir(directory)).filter(n=>/^(licen[cs]e|copying|notice)(\.|$)/i.test(n));
  sections.push(`\n${'='.repeat(72)}\n${pkg.name}@${pkg.version}\nLicense: ${typeof pkg.license==='string'?pkg.license:JSON.stringify(pkg.license)}\nRepository: ${typeof pkg.repository==='string'?pkg.repository:pkg.repository?.url||''}`);
  for(const name of names)sections.push(`\n--- ${name} ---\n${await readFile(`${directory}/${name}`,'utf8')}`);
  if(!names.length)sections.push('See the repository above for the full license text.');
}
await writeFile('dist/THIRD_PARTY_LICENSES.txt',sections.join('\n'),'utf8');
