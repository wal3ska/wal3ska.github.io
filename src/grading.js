export function normalize(text,options={}){
  if(options.compare==='exact')return String(text||'').replace(/\r\n/g,'\n');
  const s=String(text||'').replace(/\r\n/g,'\n').trim();
  if(options.compare==='numeric'&&s!==''&&Number.isFinite(Number(s)))return String(Number(s));
  const tokens=s?s.split(/\s+/):[];
  return (options.orderIndependent?tokens.sort():tokens).join(' ');
}
export function checkResult(question,test,result,actualFiles=[]){
  const expectedCode=test.exitCode??0;
  const outputOk=question.ignoreStdout||normalize(result.stdout,question)===normalize(test.expected,question);
  const exitOk=result.exitCode===expectedCode;
  const differences=[];
  if(test.after){
    const expected=new Map(test.after.map(e=>[e.path,e]));
    const before=new Map((test.before||[]).map(e=>[e.path,e]));
    const fileValue=(text,path)=>{
      if(before.get(path)?.content===expected.get(path)?.content)return String(text??'');
      const lines=String(text??'').replace(/\r\n/g,'\n').trimEnd().split('\n').map(line=>line.trim());
      return (question.orderIndependent?lines.sort():lines).join('\n');
    };
    const actual=new Map(actualFiles.filter(e=>e.path==='/home'||e.path.startsWith('/home/')).map(e=>[e.path,e]));
    for(const path of new Set([...expected.keys(),...actual.keys()])){
      const e=expected.get(path),a=actual.get(path);
      if(!a)differences.push({path,reason:'Dosya veya dizin eksik',expected:e.type,actual:'yok'});
      else if(!e)differences.push({path,reason:'Beklenmeyen dosya veya dizin',expected:'yok',actual:a.type});
      else if(e.type!==a.type)differences.push({path,reason:'Dosya türü farklı',expected:e.type,actual:a.type});
      else if(e.type==='file'&&fileValue(a.content,path)!==fileValue(e.content,path))differences.push({path,reason:'İçerik farklı',expected:e.content,actual:a.content});
      else if(e.type==='symlink'&&e.target!==a.target)differences.push({path,reason:'Bağlantı hedefi farklı',expected:e.target,actual:a.target});
    }
  }
  return {passed:!!outputOk&&exitOk&&differences.length===0,outputOk,exitOk,differences,expected:test.expected,expectedCode,...result,name:test.name};
}
