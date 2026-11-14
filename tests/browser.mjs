import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_ENTRY?pathToFileURL(process.env.PLAYWRIGHT_ENTRY).href:'playwright');
const browser=await chromium.launch({headless:true,executablePath:process.env.TEST_BROWSER||undefined});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await mkdir('tmp/qa',{recursive:true});
const site=process.env.TEST_URL||'http://127.0.0.1:4173/bil214/';
await page.goto(site);await page.getByRole('heading',{name:'Kodunu yaz. Çalıştır. Öğren.'}).waitFor();
await page.screenshot({path:'tmp/qa/desktop.png',fullPage:true});
console.log('PASS: initial page at /bil214/');
const questions=JSON.parse(await readFile('data/questions.json','utf8'));
const solutions=JSON.parse(await readFile('tests/solutions.json','utf8'));
await page.evaluate(()=>{
  window.testWorkers={};window.testSequence=0;
  window.workerRequest=(kind,payload,timeout=60000)=>new Promise((resolve,reject)=>{
    const worker=window.testWorkers[kind]??=new Worker(new URL(`assets/${kind}-worker.js`,location.href),kind==='c'?{}:{type:'module'});
    const id=++window.testSequence;
    const timer=setTimeout(()=>{worker.terminate();delete window.testWorkers[kind];reject(Error(kind+' timeout'));},timeout);
    worker.onmessage=({data})=>{if(data.id!==id)return;clearTimeout(timer);data.error?reject(Error(data.error)):resolve(data);};
    worker.onerror=e=>{clearTimeout(timer);reject(Error(e.message));};
    worker.postMessage({...payload,id});
  });
});
const init=await page.evaluate(()=>window.workerRequest('bash',{type:'init',files:{'/home/ogrenci/hello.txt':'Merhaba\n'}}));
assert.equal(init.cwd,'/home/ogrenci');
for(const [code,expected]of [
  ['mkdir -p a/b; echo merhaba > a/b/not.txt; mv a/b/not.txt a/not.txt; cd a; x=7; arr=(bir iki); f(){ echo fonksiyon; }; cat not.txt','merhaba\n'],
  ['pwd; echo "$x ${arr[1]}"; f','/home/ogrenci/a\n7 iki\nfonksiyon\n'],
  ['cp not.txt kopya; rm not.txt; ls','b\nkopya\n']
]){
  const r=await page.evaluate(code=>window.workerRequest('bash',{type:'terminal',code}),code);
  assert.equal(r.stdout,expected,JSON.stringify({stdout:r.stdout,stderr:r.stderr,cwd:r.cwd}));assert.equal(r.stderr,'');
}
console.log('PASS: Bash files, cwd, scalar, array and function persistence');
const results=[];
for(const q of questions){
  if(q.mode==='prediction')continue;
  const payload=q.language==='c'?{code:q.mode==='function'?q.prefix+solutions[q.id]+q.harness:solutions[q.id],tests:q.tests}:{type:'grade',code:solutions[q.id],tests:q.tests};
  const r=await page.evaluate(({kind,payload})=>window.workerRequest(kind,payload),{kind:q.language==='c'?'c':'bash',payload});
  if(r.compileError)throw Error(q.id+' compile error: '+r.stderr);
  const {checkResult}=await import('../src/grading.js');
  const checked=r.results.map((x,i)=>checkResult(q,q.tests[i],x,x.entries));
  for(const x of checked)assert.ok(x.passed,q.id+' '+JSON.stringify(x));
  results.push({question:q.id,tests:checked.length,passed:true});
  if(q.language==='c')console.log(`PASS: ${q.id} (${checked.length} C tests)`);
}
console.log(`PASS: ${results.length} executable questions / ${results.reduce((n,x)=>n+x.tests,0)} cases`);
const compileFailure=await page.evaluate(()=>window.workerRequest('c',{code:'int main(){ THIS IS NOT C; }'}));
assert.ok(compileFailure.compileError);assert.match(compileFailure.stderr,/error/);
const utf=await page.evaluate(()=>window.workerRequest('c',{code:'#include <stdio.h>\nint main(){char s[80];fgets(s,80,stdin);printf("Türkçe: %s",s);return 0;}',tests:[{stdin:'çalışma\n',args:[]}]}));
assert.equal(utf.results[0].stdout,'Türkçe: çalışma\n');
console.log('PASS: C diagnostics, stdin and UTF-8');
// Test the actual UI, including wrong/right feedback and persisted drafts.
await page.locator('.cm-content').fill(solutions['c3-1']);
await page.getByRole('button',{name:'Kontrol et',exact:true}).click();
await page.getByText('Doğru',{exact:true}).waitFor({timeout:60000});
await page.screenshot({path:'tmp/qa/c-success.png',fullPage:true});
await page.locator('.cm-content').fill('int soru01(char s[],char c){return 0;}');
await page.getByRole('button',{name:'Kontrol et',exact:true}).click();
await page.getByText('Yanlış',{exact:true}).waitFor({timeout:60000});
await page.reload();await page.locator('.cm-content').waitFor();
assert.match(await page.locator('.cm-content').innerText(),/return 0/);
await page.getByRole('button',{name:'Serbest laboratuvar',exact:true}).click();
await page.locator('#terminal-command').fill('mkdir -p deneme; echo test > deneme/a.txt; mv deneme/a.txt deneme/b.txt; cd deneme; pwd');
await page.locator('#terminal-command').press('Enter');
await page.waitForFunction(()=>document.querySelector('#cwd-label')?.textContent==='/home/ogrenci/deneme');
await page.screenshot({path:'tmp/qa/lab.png',fullPage:true});
await page.reload();await page.waitForFunction(()=>document.querySelector('#cwd-label')?.textContent==='/home/ogrenci/deneme');
await page.locator('#terminal-command').fill('cat b.txt');await page.locator('#terminal-command').press('Enter');
await page.waitForFunction(()=>document.querySelector('#terminal-body')?.textContent.includes('test'));
console.log('PASS: UI feedback, draft and filesystem persistence');
// Terminal changes update clean editor buffers, while unsaved drafts survive.
await page.locator('[data-tree="lab"][data-path="/home/ogrenci/deneme"]').click();
await page.locator('[data-tree="lab"][data-path="/home/ogrenci/deneme/b.txt"]').click();
await page.locator('#terminal-command').fill('echo updated > b.txt');await page.locator('#terminal-command').press('Enter');
await page.waitForFunction(()=>document.querySelector('.cm-content')?.textContent.includes('updated'));
await page.locator('.cm-content').fill('unsaved draft');
await page.locator('#terminal-command').fill('echo external > b.txt');await page.locator('#terminal-command').press('Enter');
await page.waitForFunction(()=>!document.querySelector('[data-action="run"]').disabled);
assert.equal(await page.locator('.cm-content').innerText(),'unsaved draft');
await page.locator('[data-action="new-file"]').click();await page.locator('#new-path').fill('./b.txt');
await page.locator('[data-action="create-file"]').click();
await page.waitForFunction(()=>document.querySelector('#toast')?.textContent.includes('zaten'));
await page.getByRole('button',{name:'Kapat',exact:true}).click();
await page.locator('[data-action="new-file"]').click();await page.locator('#new-path').fill('../created.txt');
await page.locator('[data-action="create-file"]').click();
await page.waitForFunction(()=>document.querySelector('#editor-filename')?.textContent==='/home/ogrenci/created.txt');
await page.locator('[data-tree="lab"][data-path="/home/ogrenci/deneme/b.txt"]').click();
assert.equal(await page.locator('.cm-content').innerText(),'unsaved draft');
console.log('PASS: editor/terminal synchronization, unsaved drafts and safe file creation');
await page.getByRole('button',{name:'Kaynaklar',exact:true}).click();
await page.locator('#resource-search').fill('pointer1.c');assert.equal(await page.locator('.resource-item').count(),1);
await page.locator('.resource-item').click();await page.getByRole('button',{name:'Kapat',exact:true}).click();
await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'Sorular',exact:true}).click();
await page.screenshot({path:'tmp/qa/mobile.png',fullPage:true});
assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),'Mobile horizontal overflow');
await page.getByRole('button',{name:'Soru menüsünü aç'}).click();assert.ok(await page.locator('.sidebar').isVisible());
assert.deepEqual(errors,[]);
await writeFile('tmp/qa/results.json',JSON.stringify({results,errors,passed:true},null,2));
console.log('PASS: archive search and mobile layout. No page errors.');
await browser.close();
