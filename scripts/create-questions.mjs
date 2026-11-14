import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {cQuestions} from '../content/c.mjs';
import {bashQuestions} from '../content/bash.mjs';
import {newShell,runScript,snapshot,HOME} from '../src/shell-core.mjs';
const materials=JSON.parse(await readFile('data/materials.json','utf8'));
const init=materials.examples.find(e=>e.path==='init.sh').content;
const solutions={};
for(const q of bashQuestions){
  solutions[q.id]=q.mode==='prediction'?q.tests[0].expected:q.reference;
  if(q.mode==='prediction')continue;
  q.tests=[];
  for(const c of q.cases){
    const b=newShell({files:c.files,env:c.env});
    for(const d of c.dirs||[])await b.fs.mkdir(d,{recursive:true});
    if(q.initScript){const r=await b.exec(init,{cwd:HOME});if(r.exitCode)throw Error(q.id+' init: '+r.stderr);}
    if(c.setup){const r=await b.exec(c.setup,{cwd:HOME});if(r.exitCode)throw Error(q.id+' setup: '+r.stderr);}
    const before=await snapshot(b);
    const result=await runScript(b,q.reference,c);
    if(result.stderr)throw Error(q.id+' reference: '+result.stderr);
    if(result.exitCode&&!q.ignoreStdout)throw Error(q.id+' unexpected exit: '+result.exitCode);
    q.tests.push({name:c.name,stdin:c.stdin,args:c.args,cwd:c.cwd,env:c.env,before,after:await snapshot(b),expected:result.stdout,exitCode:result.exitCode});
  }
  delete q.reference;delete q.cases;delete q.initScript;
}
for(const q of cQuestions){solutions[q.id]=q.solution;delete q.solution;}
const questions=[...cQuestions,...bashQuestions];
for(const q of questions){
  const d=materials.documents.find(d=>d.name===q.source);
  if(!d)throw Error('Source missing: '+q.source);
  q.original=d.pages[q.page-1];
  q.testCount=q.tests.length;
}
if(questions.length!==100)throw Error('Unexpected question count '+questions.length);
await mkdir('tests',{recursive:true});
await writeFile('data/questions.json',JSON.stringify(questions,null,2));
await writeFile('tests/solutions.json',JSON.stringify(solutions,null,2));
console.log(`${questions.length} questions, ${questions.reduce((n,q)=>n+q.tests.length,0)} test cases.`);
