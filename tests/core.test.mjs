import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {Worker} from 'node:worker_threads';
import {restore,runScript,snapshot,newShell} from '../src/shell-core.mjs';
import {checkResult,normalize} from '../src/grading.js';
const questions=JSON.parse(await readFile(new URL('../data/questions.json',import.meta.url),'utf8'));
const solutions=JSON.parse(await readFile(new URL('./solutions.json',import.meta.url),'utf8'));
test('course inventory and all 100 question sources are present',async()=>{
  const m=JSON.parse(await readFile(new URL('../data/materials.json',import.meta.url),'utf8'));
  assert.equal(m.documents.length,25);assert.equal(m.examples.length,189);assert.equal(m.documents.reduce((n,d)=>n+d.pageCount,0),414);
  assert.equal(questions.length,100);assert.equal(new Set(questions.map(q=>q.id)).size,100);
  for(const q of questions){assert.ok(m.documents.some(d=>d.path===q.source));assert.ok(q.tests.length>0);assert.ok(q.original.length>0);}
});
test('all Bash references pass and incorrect submissions fail',async()=>{
  let count=0;
  for(const q of questions.filter(q=>q.language==='bash')){
    if(q.mode==='prediction'){assert.ok(checkResult(q,q.tests[0],{stdout:solutions[q.id],exitCode:0}).passed);continue;}
    let wrongRejected=false;
    for(const t of q.tests){
      const shell=await restore(t.before,{cwd:t.cwd,env:t.env});
      const r=await runScript(shell,solutions[q.id],t);
      const check=checkResult(q,t,r,await snapshot(shell));
      assert.ok(check.passed,q.id+' '+JSON.stringify(check));
      const bad=await restore(t.before,{cwd:t.cwd,env:t.env});
      const badResult=await runScript(bad,'echo incorrect',t);
      wrongRejected||=!checkResult(q,t,badResult,await snapshot(bad)).passed;
      count++;
    }
    assert.ok(wrongRejected,q.id+' accepted an incorrect solution');
  }
  console.log('Bash reference cases:',count);
});
test('filesystem grading detects omitted, extra and corrupted files',async()=>{
  const q=questions.find(q=>q.id==='b-lab1-4'),t=q.tests[0];
  assert.equal(checkResult(q,t,{stdout:'',exitCode:0},t.before).passed,false);
  assert.equal(checkResult(q,t,{stdout:'',exitCode:0},[...t.after,{path:'/home/extra',type:'file',content:''}]).passed,false);
  assert.equal(normalize('  3\n4 '),'3 4');
});
test('real C compilation: every function/program and negative submissions',async()=>{
  const worker=new Worker(new URL('./c-host.mjs',import.meta.url));let id=0;
  const request=payload=>new Promise((resolve,reject)=>{
    const requestId=++id;
    const timer=setTimeout(()=>{worker.terminate();reject(Error('C test timeout'));},30000);
    const onError=e=>{clearTimeout(timer);worker.off('message',onMessage);reject(e);};
    const onMessage=data=>{if(data.id!==requestId)return;clearTimeout(timer);worker.off('message',onMessage);worker.off('error',onError);data.error?reject(Error(data.error)):resolve(data);};
    worker.on('message',onMessage);worker.once('error',onError);worker.postMessage({...payload,id:requestId});
  });
  try{
    for(const q of questions.filter(q=>q.language==='c')){
      const code=q.mode==='function'?q.prefix+solutions[q.id]+q.harness:solutions[q.id];
      const result=await request({code,tests:q.tests});
      assert.ok(!result.compileError,q.id+' '+result.stderr);
      for(let i=0;i<q.tests.length;i++)assert.ok(checkResult(q,q.tests[i],result.results[i]).passed,q.id+' '+JSON.stringify(result.results[i])+' expected '+q.tests[i].expected);
      const wrong=await request({code:q.mode==='function'?q.prefix+q.starter+q.harness:q.starter,tests:q.tests});
      assert.ok(wrong.compileError||wrong.results.some((r,i)=>!checkResult(q,q.tests[i],r).passed),q.id+' starter incorrectly passed');
      console.log('C passed:',q.id,q.tests.length);
    }
    const invalid=await request({code:'int main(){ THIS IS NOT C; }'});assert.ok(invalid.compileError);assert.match(invalid.stderr,/error/);
    const utf=await request({code:'#include <stdio.h>\nint main(){char s[80];fgets(s,80,stdin);printf("Türkçe: %s",s);return 0;}',tests:[{stdin:'çalışma\n',args:[]}]});assert.equal(utf.results[0].stdout,'Türkçe: çalışma\n');
    const args=await request({code:'#include <stdio.h>\nint main(int argc,char**argv){printf("%d %s",argc,argv[1]);return 7;}',tests:[{args:['hello world']}]});assert.equal(args.results[0].stdout,'2 hello world');assert.equal(args.results[0].exitCode,7);
  }finally{await worker.terminate();}
});
