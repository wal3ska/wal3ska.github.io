import {EditorView,basicSetup} from 'codemirror';
import {EditorState,Compartment} from '@codemirror/state';
import {cpp} from '@codemirror/lang-cpp';
import {StreamLanguage} from '@codemirror/language';
import {shell as shellLanguage} from '@codemirror/legacy-modes/mode/shell';
import {keymap} from '@codemirror/view';
import {indentWithTab} from '@codemirror/commands';
import {Runtime} from './runtime.js';
import {editorTheme} from './theme.js';
import {readPreferences,savePreferences,readWorkspace,saveWorkspace} from './storage.js';
// Keep the grading rules in a small browser-only module; the shell stays in its worker.
import {checkResult,normalize} from './grading.js';

const $=s=>document.querySelector(s);
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const base=new URL('../',import.meta.url);
const url=p=>new URL(p,base).href;
const shapes={code:'<path d="m8 7-5 5 5 5m8-10 5 5-5 5M14 4l-4 16"/>',book:'<path d="M4 4h6a3 3 0 0 1 3 3v14a4 4 0 0 0-4-3H4zm9 3a3 3 0 0 1 3-3h5v14h-4a4 4 0 0 0-4 3"/>',terminal:'<path d="m5 6 5 5-5 5m8 1h6"/><rect x="2" y="2" width="20" height="20" rx="3"/>',search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',play:'<path d="m8 5 12 7-12 7z"/>',check:'<path d="m5 12 4 4L19 6"/>',close:'<path d="m6 6 12 12M18 6 6 18"/>',file:'<path d="M13 3H5v18h14V9zM13 3v6h6"/>',folder:'<path d="M3 5h6l2 3h10v12H3z"/>',download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',upload:'<path d="M12 16V4m-5 5 5-5 5 5M4 16v5h16v-5"/>',help:'<circle cx="12" cy="12" r="9"/><path d="M9 8a3 3 0 0 1 6 0c0 2-3 2-3 5m0 3v1"/>',reset:'<path d="M3 10a9 9 0 1 1 2 8M3 3v7h7"/>',external:'<path d="M14 3h7v7m0-7L10 14M10 3H3v18h18v-7"/>',left:'<path d="m14 6-6 6 6 6"/>',right:'<path d="m10 6 6 6-6 6"/>',menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',save:'<path d="M4 3h13l4 4v14H3V3zm3 0v6h10V3M7 21v-8h10v8"/>',plus:'<path d="M12 4v16M4 12h16"/>',stop:'<rect x="5" y="5" width="14" height="14" rx="1"/>',shield:'<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6z"/><path d="m8 12 3 3 5-6"/>'};
const icon=n=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${shapes[n]||shapes.file}</svg>`;
shapes.sun='<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>';
shapes.moon='<path d="M20.8 13.1A9 9 0 0 1 10.9 3.2a9 9 0 1 0 9.9 9.9Z"/>';
shapes.copy='<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>';
let prefs=readPreferences();prefs.drafts??={};prefs.progress??={};
const systemTheme=matchMedia('(prefers-color-scheme: dark)');
let questions=[],materials={},view=prefs.view||'questions',qid=prefs.qid||'c3-1',languageFilter='all',search='',onlyTodo=false;
let editor=null,codeLanguage=new Compartment(),codeTheme=new Compartment(),busy=false,output=null,outputTab='output',selectedTest=0;
let labLanguage=prefs.labLanguage||'bash',labState=null,labReady=false,labInitializing=null,labPath=prefs.labPath||'/home/ogrenci/calisma.sh',labCFiles={};
let terminalLog=[],terminalHistory=[],historyIndex=0,resourceSearch='',resourceFilter='all',treeExpanded=new Set(['/','/home','/home/ogrenci']),questionTree=null;
let saveTimer,toastTimer,epoch=0;
const cRuntime=new Runtime('c',progress),bashRuntime=new Runtime('bash',progress);
const cDefault='#include <stdio.h>\n\nint main(void) {\n    printf("Merhaba BIL214!\\n");\n    return 0;\n}\n';
const bashDefault='#!/bin/bash\n\n# Klasör oluştur, dosya yaz ve taşı.\nmkdir -p projeler/notlar\necho "Merhaba BIL214!" > projeler/notlar/merhaba.txt\ncat projeler/notlar/merhaba.txt\n\n# Aşağıdaki terminalde komutlarla devam edebilirsin.\n';
function current(){return questions.find(q=>q.id===qid)||questions[0];}
function draftKey(){return view==='lab'?'lab-'+labLanguage:qid;}
function getDraft(){const q=current();return prefs.drafts[draftKey()]||{code:view==='lab'?(labLanguage==='bash'?bashDefault:cDefault):q.starter,stdin:view==='lab'?'':q.tests[0]?.stdin||'',args:view==='lab'?'':formatArgs(q.tests[0]?.args||[])};}
function formatArgs(a){return a.map(s=>/\s/.test(s)?JSON.stringify(s):s).join(' ');}
function parseArgs(text){
  const result=[];let word='',mode='',started=false;
  for(let i=0;i<text.length;i++){const c=text[i];if(c==='\\'&&mode!=="'"){if(i+1===text.length)throw Error('Argüman sonunda eksik kaçış karakteri.');word+=text[++i];started=true;}else if(mode){if(c===mode)mode='';else word+=c;}else if(c==='"'||c==="'"){mode=c;started=true;}else if(/\s/.test(c)){if(started){result.push(word);word='';started=false;}}else{word+=c;started=true;}}
  if(mode)throw Error('Argümanlardaki tırnak kapatılmamış.');if(started)result.push(word);return result;
}
function toast(message){const t=$('#toast');t.textContent=message;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),4500);}
function persist(){try{prefs={...prefs,view,qid,labLanguage,labPath};savePreferences(prefs);}catch{toast('Tarayıcı kaydı doldu. Yedek indirerek çalışmalarını koru.');}}
function applyTheme(){
  const dark=prefs.theme==='dark'||(prefs.theme!=='light'&&systemTheme.matches);
  document.documentElement.dataset.theme=dark?'dark':'light';
  document.querySelector('meta[name="theme-color"]').content=dark?'#101725':'#3558d4';
  const button=$('[data-action="theme"]');
  if(button){button.innerHTML=icon(dark?'sun':'moon');button.setAttribute('aria-pressed',String(dark));button.title=dark?'Açık temaya geç':'Koyu temaya geç';}
  if(editor)editor.dispatch({effects:codeTheme.reconfigure(editorTheme(dark))});
}
function saveDraft(){if(!editor)return;const key=draftKey();prefs.drafts[key]={code:editor.state.doc.toString(),stdin:$('#stdin')?.value||'',args:$('#args')?.value||''};if(view==='lab'&&labLanguage==='bash'){prefs.fileDrafts??={};const code=editor.state.doc.toString(),saved=labState?.entries.find(x=>x.path===labPath);if(saved?.content===code)delete prefs.fileDrafts[labPath];else prefs.fileDrafts[labPath]=code;}clearTimeout(saveTimer);saveTimer=setTimeout(persist,300);}
function saveNow(){saveDraft();clearTimeout(saveTimer);persist();}
function progress(message){const status=$('#run-status');if(status)status.innerHTML=`<span class="working"><i class="spinner"></i>${escape(message)}</span>`;}
function setBusy(value){busy=value;document.querySelectorAll('[data-run]').forEach(b=>b.disabled=value);const stop=$('[data-action="stop"]');if(stop)stop.hidden=!value;}
function cancel(){if(!busy)return;cRuntime.stop();bashRuntime.stop();labReady=false;setBusy(false);}
function modal(html){
  $('#modal-body').innerHTML=html;
  const title=$('#modal-body h2');
  if(title){title.id='modal-title';$('#modal').setAttribute('aria-labelledby','modal-title');}
  else $('#modal').removeAttribute('aria-labelledby');
  $('#modal').showModal();
}
function showAnswer(){
  const q=current();
  if(typeof q.answer!=='string'){toast('Cevap anahtarı yüklenemedi. Sayfayı yenile.');return;}
  const prediction=q.mode==='prediction';
  const guidance=prediction?'Betiğin beklenen çıktısı aşağıda.':q.mode==='function'?'Yalnızca fonksiyonu yaz; main test sistemi tarafından eklenir.':q.language==='bash'?'Komutları sorunun başlangıç dosyaları ve çalışma konumuyla dene.':'main dahil tam program aşağıda.';
  modal(`<h2>Cevap anahtarı</h2><p class="answer-question">${escape(q.set)} · ${escape(q.number)} · ${escape(q.title)}</p><p class="answer-description">${prediction?'Çıktı tahmini sorusunun cevabı.':'Bu atölye için hazırlanmış, testlerden geçen örnek çözüm. Farklı doğru çözümler de olabilir.'} ${guidance}</p><div class="answer-toolbar"><span class="language-badge ${q.language}">${prediction?'Beklenen çıktı':q.language==='c'?'C çözümü':'Bash çözümü'}</span><button class="small" data-action="copy-answer" data-answer-id="${escape(q.id)}">${icon('copy')}Kopyala</button></div><pre class="answer-code" id="answer-code" tabindex="0" aria-label="${prediction?'Beklenen çıktı':'Örnek çözüm kodu'}"><code>${escape(q.answer)}</code></pre><p class="note">${escape(q.note)}</p>`);
}
async function copyAnswer(id){
  const q=questions.find(q=>q.id===id);if(typeof q?.answer!=='string')return;
  try{await navigator.clipboard.writeText(q.answer);toast('Cevap anahtarı kopyalandı.');}
  catch{const code=$('#answer-code');if(!code)return;const range=document.createRange();range.selectNodeContents(code);const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);code.focus();toast('Cevap seçildi. Ctrl+C ile veya seçim menüsünden kopyala.');}
}
function sidebar(){return `<aside class="sidebar" id="sidebar"><div class="sidebar-top"><div class="sidebar-heading"><strong>Soru bankası</strong><span class="count">${questions.length}</span></div><div class="searchbox">${icon('search')}<input id="question-search" aria-label="Sorularda ara" placeholder="Soru veya konu ara…" value="${escape(search)}"></div><div class="filters" role="group" aria-label="Dil filtresi">${[['all','Tümü'],['c','C'],['bash','Bash']].map(([id,t])=>`<button data-filter="${id}" class="${languageFilter===id?'active':''}">${t}</button>`).join('')}</div><button class="question-filter-state ${onlyTodo?'secondary':''}" data-action="todo">${onlyTodo?'Tüm soruları göster':'Yalnızca çözülmeyenler'}</button></div><div class="question-list" id="question-list"></div><div class="sidebar-footer"><div class="progress-label"><span>Çalışma ilerlemen</span><strong id="progress-count"></strong></div><div class="progress-track"><span id="progress-bar"></span></div></div></aside>`;}
function renderList(){
  const list=$('#question-list');if(!list)return;
  const needle=search.toLocaleLowerCase('tr');
  const filtered=questions.filter(q=>(languageFilter==='all'||q.language===languageFilter)&&(!onlyTodo||!prefs.progress[q.id]?.passed)&&`${q.title} ${q.set} ${q.description}`.toLocaleLowerCase('tr').includes(needle));
  const groups=['Lab 1','Lab 2','Lab 3','Exercises 1','Exercises 2','Exercises 3','Exercises 4','Exercises 5'];
  list.innerHTML=groups.map(set=>{const qs=filtered.filter(q=>q.set===set);return qs.length?`<div class="set-label"><span>${set}</span><span>${qs[0].language==='c'?'C':'Bash'} · ${qs.length}</span></div>${qs.map(q=>`<button class="question-link ${qid===q.id?'active':''}" data-question="${q.id}" ${qid===q.id?'aria-current="true"':''}><span class="q-marker">${q.number.replace('soru','').replace('Soru ','')}</span><span>${escape(q.title)}</span>${prefs.progress[q.id]?.passed?'<span class="done" title="Testler geçti">✓</span>':''}</button>`).join('')}`:'';}).join('')||'<div class="empty-list">Aramana uyan soru yok.</div>';
  const n=questions.filter(q=>prefs.progress[q.id]?.passed).length;
  $('#progress-count').textContent=`${n} / ${questions.length}`;$('#progress-bar').style.width=`${n/questions.length*100}%`;
}
function render(){
  editor?.destroy();editor=null;epoch++;
  $('#app').innerHTML=`<header class="topbar"><button class="quiet icon-button mobile-menu" data-action="menu" aria-label="Soru menüsünü aç">${icon('menu')}</button><div class="brand"><span class="brand-mark">214</span><div><strong>BİL214</strong><small>Sistem programlama atölyesi</small></div></div><nav class="topnav" aria-label="Ana gezinme">${[['questions','book','Sorular'],['lab','terminal','Serbest laboratuvar'],['resources','folder','Kaynaklar']].map(([id,i,t])=>`<button data-view="${id}" class="${view===id?'active':''}" ${view===id?'aria-current="page"':''}>${icon(i)}${t}</button>`).join('')}</nav><div class="top-actions"><span class="local-status"><i class="dot"></i>Tarayıcıda çalışır</span><button class="quiet icon-button" data-action="theme" aria-label="Koyu tema" aria-pressed="false" title="Koyu temaya geç">${icon('moon')}</button><button class="quiet small" data-action="backup" title="Çalışmalarını yedekle">${icon('download')}<span class="backup-label">Yedekle</span></button><button class="quiet icon-button" data-action="help" aria-label="Yardım">${icon('help')}</button></div></header><div class="app-layout">${view==='questions'?sidebar():''}<main class="main" id="main">${view==='questions'?questionView():view==='lab'?labView():resourceView()}</main></div>`;
  if(view==='questions'){renderList();mountEditor(current().language);renderOutput();renderQuestionTree();}
  if(view==='lab'){mountEditor(labLanguage);renderTree();renderTerminal();if(labLanguage==='c')renderOutput();}
  if(view==='resources')renderResources();
  applyTheme();setBusy(busy);
}
function questionView(){
  const q=current(),test=q.tests[selectedTest]||q.tests[0];const index=questions.indexOf(q);
  return `<div class="workspace-heading"><div><div class="breadcrumb">Çalışma alanı ${icon('right')} ${escape(q.set)} ${icon('right')} ${escape(q.number)}</div><h1>Kodunu yaz. Çalıştır. Öğren.</h1></div><div class="heading-right"><button class="quiet small" data-action="previous" ${index===0?'disabled':''} aria-label="Önceki soru">${icon('left')}</button><button class="button small" data-action="next" ${index===questions.length-1?'disabled':''}><span class="nav-label">Sonraki soru</span>${icon('right')}</button></div></div>
  <div class="workspace"><section class="problem-panel"><div class="panel-top"><h2>${icon('book')} Soru</h2><span class="count-label">${q.testCount} test</span></div><div class="problem-body"><span class="language-badge ${q.language}">${q.language==='c'?'C':'$_ Bash'} <span> / ${escape(q.number)}</span></span><h2 class="problem-title">${escape(q.title)}</h2><p class="problem-description">${escape(q.description)}</p><a class="source-link" href="${url(q.source)}#page=${q.page}" target="_blank" rel="noopener">${icon('external')}${escape(q.source)} · s. ${q.page}</a>
  ${q.script?`<div class="example-box"><pre>${escape(q.script)}</pre></div>`:''}
  ${q.mode!=='prediction'?`<hr class="divider"><h3>Bir örnekle başlayalım</h3><div class="example-box"><div class="label">${q.mode==='function'?'Fonksiyon girdisi':'Standart girdi / argümanlar'}</div><pre>${escape(test.display||[test.stdin?.trim(),test.args?.length?'$ '+formatArgs(test.args):''].filter(Boolean).join('\n')||test.cwd||'Girdi gerekmiyor')}</pre></div><div class="example-box"><div class="label">Beklenen ${q.ignoreStdout?'çıkış kodu':'çıktı'}</div><pre>${escape(q.ignoreStdout?String(test.exitCode):test.expected?.trim()||'(çıktı yok; dosya sistemi kontrol edilir)')}</pre></div>`:''}
  ${q.language==='bash'&&q.mode!=='prediction'?'<details open><summary>Başlangıç dosyaları</summary><div id="question-tree" class="question-files"></div></details>':''}
  <details><summary>Küçük bir ipucu</summary><p>${escape(q.hint)}</p></details><details><summary>Hocanın kaynak metni</summary><p class="muted">Kaynak sayfasının metni; şekiller ve yerleşim için PDF’yi aç.</p><pre>${escape(q.original)}</pre></details><p class="note">${escape(q.note)}</p><div class="answer-access"><button class="secondary" data-action="answer-key" aria-haspopup="dialog" aria-controls="modal"><span>${icon('book')}Cevap anahtarı</span>${icon('right')}</button></div></div><div class="question-panel-footer">${icon('shield')} Kodun ve ilerlemen bu tarayıcıda saklanır.</div></section><div class="workspace-right">${editorPanel(q.language,q.mode==='prediction'?'cikti.txt':q.language==='c'?'cozum.c':'cozum.sh',q)}${outputPanel()}</div></div><div class="statusbar"><span>TOBB ETÜ · BİL214 · 2026 Güz</span><span>Testler davranışı kontrol eder. Sınav kuralları kaynak PDF’dedir.</span></div>`;
}
function editorPanel(lang,filename,q){
  const draft=getDraft(),prediction=q?.mode==='prediction';
  return `<section class="editor-panel" aria-label="Kod editörü"><div class="editor-header"><span class="filename">${icon('code')}<span id="editor-filename">${escape(filename)}</span></span><span class="saved-label">Otomatik kayıt <i class="dot"></i></span></div><div class="editor" id="editor"></div>
  ${q?.mode==='function'?`<div class="input-panel" style="grid-template-columns:1fr"><label>Çalıştırılacak örnek<select id="sample-test">${q.tests.map((t,i)=>`<option value="${i}" ${selectedTest===i?'selected':''}>${i+1}. ${escape(t.name)}</option>`).join('')}</select></label></div>`:prediction?'':`<div class="input-panel"><label for="stdin">Standart girdi (stdin)<textarea id="stdin" spellcheck="false" placeholder="scanf / read için girdiler…">${escape(draft.stdin)}</textarea></label><label for="args">Komut satırı argümanları<input id="args" spellcheck="false" placeholder='ör. 5 "merhaba dünya"' value="${escape(draft.args)}"><span class="muted" style="font-weight:400">Her boşluk yeni bir argüman ayırır.</span></label></div>`}
  <div class="editor-footer"><span class="shortcut">Ctrl + Enter ile çalıştır</span><div class="run-actions"><button class="quiet icon-button" data-action="reset-code" title="Başlangıç koduna dön" aria-label="Başlangıç koduna dön">${icon('reset')}</button>${view==='lab'&&lang==='bash'?`<button class="small" data-action="save-file" data-run>${icon('save')}Kaydet</button>`:''}<button class="danger small" data-action="stop" hidden>${icon('stop')}Durdur</button><button class="${q?'button':'primary'}" data-action="run" data-run>${icon('play')}${prediction?'Kontrol et':'Çalıştır'}</button>${q&&!prediction?`<button class="primary" data-action="grade" data-run>${icon('check')}Kontrol et</button>`:''}</div></div></section>`;
}
function outputPanel(){return `<section class="output-panel"><div class="output-header"><div class="output-tabs"><button class="active" data-output="output">Çıktı</button><button data-output="tests">Test sonuçları</button></div><span class="output-status" id="run-status">Çalıştırmaya hazır</span></div><div class="output-body" id="output-body"></div></section>`;}
function mountEditor(lang){
  const parent=$('#editor');if(!parent)return;
  const readLang=current()?.mode==='prediction'&&view==='questions'?'text':lang;
  editor=new EditorView({parent,state:EditorState.create({doc:getDraft().code,extensions:[basicSetup,codeTheme.of(editorTheme(document.documentElement.dataset.theme==='dark')),keymap.of([indentWithTab,{key:'Mod-Enter',run:()=>{runCode(false);return true;}},{key:'Mod-s',run:()=>{view==='lab'&&labLanguage==='bash'?saveFile():saveNow();return true;}}]),codeLanguage.of(readLang==='c'?cpp():readLang==='bash'?StreamLanguage.define(shellLanguage):[]),EditorView.lineWrapping,EditorView.contentAttributes.of({'aria-label':readLang==='text'?'Çıktı cevabı':'Kod editörü',spellcheck:'false'}),EditorView.updateListener.of(update=>{if(update.docChanged)saveDraft();})]})});
}
function replaceCode(code){editor.dispatch({changes:{from:0,to:editor.state.doc.length,insert:code}});saveNow();}
function renderOutput(){
  const body=$('#output-body');if(!body)return;
  document.querySelectorAll('[data-output]').forEach(b=>b.classList.toggle('active',b.dataset.output===outputTab));
  if(!output){body.innerHTML=`<div class="output-empty">${icon('terminal')}<strong>İlk deneme senden.</strong><p>Kodunu çalıştır; çıktıyı ve test sonuçlarını burada gör.</p></div>`;return;}
  if(output.error){body.innerHTML=`<div class="result-banner failed">${icon('close')}<strong>${output.compileError?'Derleme hatası':'İşlem tamamlanamadı'}</strong></div><pre class="output-stderr">${escape(output.error)}</pre>`;return;}
  const results=output.results||[];const first=results[0]||{};
  if(outputTab==='tests'&&output.graded){
    const passed=results.filter(r=>r.passed).length;
    body.innerHTML=`<div class="result-banner ${passed===results.length?'':'failed'}">${icon(passed===results.length?'check':'close')}<div><strong>${passed===results.length?'Doğru':'Yanlış'}</strong><small>${passed} / ${results.length} test geçti${passed===results.length?' · Test edilen davranış doğru.':' · Aşağıdaki farkları kontrol et.'}</small></div></div>${results.map((r,i)=>`<details class="test-result" ${!r.passed&&results.findIndex(x=>!x.passed)===i?'open':''}><summary><span class="${r.passed?'pass':'fail'}">${r.passed?'✓':'×'}</span>Test ${i+1} · ${escape(r.name)}<span class="muted" style="margin-left:auto">${r.passed?'Geçti':'Başarısız'}</span></summary>${!r.exitOk?`<p>Çıkış kodu: <b>${r.exitCode}</b> · Beklenen: <b>${r.expectedCode}</b></p>`:''}<div class="comparison"><div><strong>Beklenen çıktı</strong><pre>${escape(r.expected||'(boş)')}</pre></div><div><strong>Senin çıktın</strong><pre>${escape(r.stdout||'(boş)')}</pre></div></div>${r.stderr?`<pre class="output-stderr">${escape(r.stderr)}</pre>`:''}${r.differences?.slice(0,12).map(d=>`<p class="source-path" style="margin-top:12px">${escape(d.path)} · ${escape(d.reason)}</p><div class="comparison"><div><strong>Beklenen</strong><pre>${escape(String(d.expected).slice(0,2000))}</pre></div><div><strong>Oluşan</strong><pre>${escape(String(d.actual).slice(0,2000))}</pre></div></div>`).join('')||''}${r.differences?.length>12?`<p>${r.differences.length-12} ek dosya farkı var.</p>`:''}</details>`).join('')}`;
  }else if(outputTab==='tests')body.innerHTML='<div class="output-empty">Henüz test yapılmadı.<p>“Kontrol et” bütün testleri çalıştırır.</p></div>';
  else body.innerHTML=`${output.graded?`<div class="result-banner ${results.every(r=>r.passed)?'':'failed'}"><strong>${results.every(r=>r.passed)?'Doğru':'Yanlış'}</strong><span>${results.filter(r=>r.passed).length}/${results.length} test</span><button class="quiet small" data-output="tests">Farkları gör</button></div>`:''}<pre class="output-stdout">${escape(first.stdout||'(Program standart çıktı üretmedi.)')}</pre>${first.stderr?`<pre class="output-stderr">${escape(first.stderr)}</pre>`:''}${output.warnings?`<details class="test-result"><summary>Derleyici uyarıları</summary><pre>${escape(output.warnings)}</pre></details>`:''}<p class="note">Çıkış kodu: ${first.exitCode??0}${output.graded?' · Yukarıda ilk testin çıktısı gösteriliyor.':''}</p>`;
}
async function runCode(grade){
  if(busy)return;saveNow();const token=epoch,q=current(),isLab=view==='lab',lang=isLab?labLanguage:q.language;
  const code=editor.state.doc.toString();
  if(code.length>200000){toast('Kod 200 KB sınırını aşıyor.');return;}
  if(!isLab&&q.mode==='prediction'){
    const r={stdout:code.replaceAll('--blank--',''),stderr:'',exitCode:0};output={graded:true,results:[checkResult(q,q.tests[0],r)]};outputTab='tests';prefs.progress[q.id]={passed:output.results[0].passed,date:new Date().toISOString()};persist();renderList();renderOutput();return;
  }
  setBusy(true);output=null;if(!isLab||lang==='c')renderOutput();progress(grade?'Testler hazırlanıyor…':'Çalıştırılıyor…');
  try{
    const draft=getDraft();const args=parseArgs(draft.args||'');
    if(isLab&&lang==='bash'){
      await ensureLab();
      // Running a script also saves the current editor file, like a normal editor.
      await bashRuntime.request({type:'write',path:labPath,content:code});
      const r=await bashRuntime.request({type:'script',code,args,stdin:draft.stdin});
      if(token!==epoch)return;await acceptLab(r);terminalLog.push({command:`bash ${labPath}${args.length?' '+formatArgs(args):''}`,stdout:r.stdout,stderr:r.stderr,exitCode:r.exitCode});renderTerminal();renderTree();
    }else{
      const tests=isLab?[{stdin:draft.stdin,args}]:grade?q.tests:[q.mode==='function'?q.tests[selectedTest]:{...q.tests[0],stdin:draft.stdin,args}];
      let r;
      if(lang==='c')r=await cRuntime.request({code:(!isLab&&q.mode==='function'?q.prefix+code+q.harness:code),tests,files:isLab?labCFiles:{}});
      else {if(labInitializing)await labInitializing;r=await bashRuntime.request({type:grade?'grade':'questionRun',code,tests});}
      if(token!==epoch)return;
      if(r.compileError){output={error:r.stderr||'C kodu derlenemedi.',compileError:true};}
      else{
        const results=r.results.map((result,i)=>grade?checkResult(q,tests[i],result,result.entries):result);
        output={results,warnings:r.warnings,graded:grade};outputTab=grade?'tests':'output';
        if(grade){prefs.progress[q.id]={passed:results.every(r=>r.passed),date:new Date().toISOString()};persist();renderList();}
        if(lang==='bash'&&r.results[0]?.entries){questionTree=r.results[0].entries;renderQuestionTree();}
      }
      renderOutput();
    }
    const status=$('#run-status');if(status)status.textContent='Tamamlandı';
  }catch(e){
    if(token!==epoch)return;
    if(isLab&&lang==='bash'){terminalLog.push({stderr:e.message});renderTerminal();labReady=!!bashRuntime.worker;}
    else{output={error:e.message};renderOutput();}
    const status=$('#run-status');if(status)status.textContent='İşlem durdu';
  }finally{if(token===epoch)setBusy(false);}
}
function defaultFiles(){const files={'/home/ogrenci/calisma.sh':bashDefault,'/home/ogrenci/notlar/merhaba.txt':'BIL214 calisma alanina hos geldin!\nmkdir, touch, mv, cp, rm ve cd komutlarini deneyebilirsin.\n','/home/ogrenci/init.sh':materials.examples.find(e=>e.path==='init.sh')?.content||''};for(const e of materials.examples)files['/home/ogrenci/ders/'+e.path]=e.content;return files;}
async function ensureLab(){if(labReady&&bashRuntime.worker)return;if(labInitializing)return labInitializing;labInitializing=(async()=>{const r=await bashRuntime.request({type:'init',state:labState,files:defaultFiles()});labReady=true;await acceptLab(r);})().finally(()=>{labInitializing=null;});return labInitializing;}
async function acceptLab(r){
  const previous=labState?.entries.find(x=>x.path===labPath),next=r.entries.find(x=>x.path===labPath);
  const reloadEditor=view==='lab'&&labLanguage==='bash'&&editor&&previous?.type==='file'&&next?.type==='file'&&editor.state.doc.toString()===previous.content&&next.content!==previous.content;
  labState={entries:r.entries,cwd:r.cwd,env:r.env,declarations:r.declarations,functions:r.functions,lastExit:r.lastExit};
  if(reloadEditor)replaceCode(next.content);
  for(const file of r.entries)if(file.type==='file'&&prefs.fileDrafts?.[file.path]===file.content)delete prefs.fileDrafts[file.path];
  try{await saveWorkspace(labState);}catch{toast('Dosyalar tarayıcıya kaydedilemedi. Yedek indir.');}
}
function labView(){return `<div class="workspace-heading"><div><div class="breadcrumb">Kendi çalışma alanın</div><h1>Denemek için serbest bir alan.</h1></div><div class="heading-right"><button class="small" data-action="export-workspace">${icon('download')}Dosyaları indir</button></div></div><div class="lab-top"><p>${labLanguage==='bash'?'Bir komut yaz. Dosyaların nasıl değiştiğini izle.':'C kodunu yaz; standart girdi ve argümanlarla çalıştır.'}</p><select id="lab-language" aria-label="Laboratuvar dili"><option value="bash" ${labLanguage==='bash'?'selected':''}>Bash</option><option value="c" ${labLanguage==='c'?'selected':''}>C</option></select></div><div class="workspace lab-layout"><aside class="lab-explorer"><div class="panel-top"><h2>${icon('folder')} ${labLanguage==='bash'?'Dosyalar':'C laboratuvarı'}</h2>${labLanguage==='bash'?`<button class="quiet icon-button" data-action="new-file" aria-label="Yeni dosya">${icon('plus')}</button>`:''}</div>${labLanguage==='bash'?`<div class="tree-toolbar"><code id="cwd-label">${escape(labState?.cwd||'/home/ogrenci')}</code><button class="quiet icon-button small" data-action="refresh-tree" aria-label="Dosya ağacını yenile">${icon('reset')}</button></div><div class="tree" id="lab-tree"></div><div class="explorer-foot">Dosyayı açmak için adına tıkla.<br>Değişiklikler tarayıcıda saklanır.<br><button class="quiet small" data-action="reset-lab">Alanı sıfırla</button></div>`:`<div class="compact-message"><strong>Gerçek C derleyicisi</strong><p>Clang, kodunu tarayıcıda WebAssembly olarak derler.</p><p>scanf, diziler, işaretçiler, yapılar ve standart kütüphane işlevleriyle çalışabilirsin.</p><p>İlk çalıştırmada yaklaşık 60 MB derleyici indirilir ve önbelleğe alınır.</p><p><code>fork</code>, ağ ve işletim sistemi süreçleri desteklenmez.</p><button class="small" data-view="resources">Ders örneklerini aç</button></div>`}</aside><div class="workspace-right">${editorPanel(labLanguage,labLanguage==='bash'?labPath:'main.c')}${labLanguage==='bash'?`<section class="output-panel terminal-panel"><div class="output-header"><strong style="font-size:12px">${icon('terminal')} Terminal</strong><span class="output-status" id="run-status">Bash çalışma alanı</span><button class="quiet small" data-action="clear-terminal">Temizle</button></div><div class="terminal-body" id="terminal-body" role="log" aria-live="polite"></div><form class="terminal-input" id="terminal-form"><label for="terminal-command">$</label><input id="terminal-command" autocomplete="off" spellcheck="false" aria-label="Bash komutu" placeholder="mkdir deneme && cd deneme"><button class="quiet icon-button" type="submit" data-run aria-label="Komutu çalıştır">${icon('right')}</button></form></section>`:outputPanel()}</div></div><div class="statusbar"><span>Dosyalar yalnızca bu tarayıcının sanal çalışma alanındadır.</span><span>Bash uyumlu yorumlayıcı · C11 / wasm32</span></div>`;}
function treeHtml(entries,context){
  const visible=entries.filter(e=>!e.path.startsWith('/tmp/.bil214')&&(!/^\/(bin|usr|dev|proc)(\/|$)/.test(e.path)));
  const byParent=new Map();
  for(const e of visible){if(e.path==='/')continue;const parent=e.path.slice(0,e.path.lastIndexOf('/'))||'/';if(!byParent.has(parent))byParent.set(parent,[]);byParent.get(parent).push(e);}
  function branch(path,depth){return (byParent.get(path)||[]).sort((a,b)=>(a.type==='directory'?0:1)-(b.type==='directory'?0:1)||a.path.localeCompare(b.path)).map(e=>{
    const dir=e.type==='directory',open=context==='question'?true:treeExpanded.has(e.path),name=e.path.split('/').at(-1);
    const row=`<button class="tree-row ${dir?'directory':''} ${context==='lab'&&labPath===e.path?'active':''}" data-tree="${context}" data-path="${escape(e.path)}" data-kind="${e.type}" style="padding-left:${8+depth*13}px" title="${escape(e.path)}"><span class="chevron">${dir?(open?'⌄':'›'):''}</span>${icon(dir?'folder':'file')}<span>${escape(name)}${e.type==='symlink'?' ↗':''}</span></button>`;
    return row+(dir&&open?branch(e.path,depth+1):'');
  }).join('');}
  return branch('/',0)||'<div class="tree-empty">Henüz dosya yok.</div>';
}
function renderTree(){const node=$('#lab-tree');if(node)node.innerHTML=labState?treeHtml(labState.entries,'lab'):'<div class="tree-empty">Dosya sistemi hazırlanıyor…</div>';if($('#cwd-label'))$('#cwd-label').textContent=labState?.cwd||'/home/ogrenci';}
function renderQuestionTree(){const node=$('#question-tree');if(!node)return;const entries=questionTree||current().tests[0]?.before||[];node.innerHTML=treeHtml(entries,'question');}
function renderTerminal(){const t=$('#terminal-body');if(!t)return;t.innerHTML=terminalLog.length?terminalLog.map(r=>`<div class="terminal-chunk">${r.command?`<div class="terminal-prompt">$ ${escape(r.command)}</div>`:''}${escape(r.stdout||'')}${r.stderr?`<span class="output-stderr">${escape(r.stderr)}</span>`:''}${r.exitCode?`<div class="muted">[çıkış kodu ${r.exitCode}]</div>`:''}</div>`).join(''):'<div class="muted">BİL214 Bash çalışma alanı\n\nKomutlarla dosya oluşturabilir, taşıyabilir ve silebilirsin.\nÖrnek: ls → cd notlar → cat merhaba.txt\nDers dosyaları: ~/ders · Laboratuvar kurulumu: bash ~/init.sh</div>';t.scrollTop=t.scrollHeight;}
async function terminal(command){if(busy||!command.trim())return;saveNow();setBusy(true);const token=epoch;terminalHistory.push(command);historyIndex=terminalHistory.length;try{await ensureLab();const r=await bashRuntime.request({type:'terminal',code:command,stdin:$('#stdin')?.value||''});if(token!==epoch)return;await acceptLab(r);if(command.trim()==='clear')terminalLog=[];else terminalLog.push({command,stdout:r.stdout,stderr:r.stderr,exitCode:r.exitCode});renderTree();renderTerminal();}catch(e){if(token===epoch){terminalLog.push({command,stderr:e.message});renderTerminal();labReady=!!bashRuntime.worker;}}finally{if(token===epoch){setBusy(false);$('#terminal-command')?.focus();}}}
async function saveFile(){if(busy)return;saveNow();setBusy(true);try{await ensureLab();const r=await bashRuntime.request({type:'write',path:labPath,content:editor.state.doc.toString()});await acceptLab(r);renderTree();toast('Dosya kaydedildi.');}catch(e){toast(e.message);}finally{setBusy(false);}}
function resourceView(){return `<div class="resource-page"><div class="workspace-heading"><div><div class="breadcrumb">Ders arşivi</div><h1>Bütün kaynaklar, aynı yerde.</h1></div><span class="count">${materials.documents.length} PDF + ${materials.examples.length} dosya</span></div><p class="resource-intro">Ders notları, hocanın alıştırmaları ve örnek kodlar. Dosya adlarında ve içeriklerinde ara; C ve Bash örneklerini laboratuvarda aç.</p><div class="resource-controls"><div class="searchbox">${icon('search')}<input id="resource-search" placeholder="Örn. pointer, printf, script5.sh…" aria-label="Kaynaklarda ara" value="${escape(resourceSearch)}"></div><select id="resource-filter" aria-label="Kaynak türü">${[['all','Bütün kaynaklar'],['notes','Ders notları'],['questions','Alıştırmalar'],['worksheets','Başvuru sayfaları'],['c','C örnekleri'],['bash','Bash örnekleri'],['text','Veri dosyaları']].map(([v,t])=>`<option value="${v}" ${v===resourceFilter?'selected':''}>${t}</option>`).join('')}</select></div><div class="resource-list" id="resource-list"></div></div>`;}
const lectureTitles=['Unix ve sistem programlama','Linux temelleri','Joker karakterler ve düzenli ifadeler','Bash betiklerine giriş','Koşullar, döngüler ve diziler','Bash fonksiyonları ve süreçler','C diline giriş','C kontrol yapıları','C fonksiyonları','Diziler ve karakter dizileri','İşaretçiler','C karakter ve metin işlevleri','Yapılar, union ve enum'];
function resourceType(r){return r.pages?(r.name.startsWith('Lecture')?'notes':r.name.startsWith('Worksheet')?'worksheets':'questions'):r.language;}
function renderResources(){const items=[...materials.documents,...materials.examples];const query=resourceSearch.toLocaleLowerCase('tr');const filtered=items.filter(r=>(resourceFilter==='all'||resourceType(r)===resourceFilter)&&`${r.path} ${r.pages?r.pages.join('\n'):r.content}`.toLocaleLowerCase('tr').includes(query));$('#resource-list').innerHTML=filtered.map(r=>{const title=r.name.startsWith('Lecture_Notes_')?`${Number(r.name.match(/\d+/)[0])}. ${lectureTitles[Number(r.name.match(/\d+/)[0])-1]}`:r.name;return `<button class="resource-item" data-resource="${escape(r.path)}"><span class="resource-icon">${icon(r.pages?'book':r.language==='text'?'file':'code')}</span><span><strong>${escape(title)}</strong><small>${escape(r.path)}</small><small>${r.pages?r.pageCount+' sayfa':r.language==='c'?'C kaynak dosyası':r.language==='bash'?'Bash betiği':r.size+' bayt · veri dosyası'}</small></span><span class="res-arrow">${icon('right')}</span></button>`;}).join('')||'<div class="empty-list">Eşleşen kaynak bulunamadı.</div>';}
function showResource(path){const r=[...materials.documents,...materials.examples].find(r=>r.path===path);if(!r)return;modal(`<h2>${escape(r.name)}</h2><p class="source-path">${escape(r.path)}</p><div class="modal-actions">${r.pages?`<a class="button primary" target="_blank" rel="noopener" href="${url(r.path)}">${icon('external')}PDF’yi aç</a>`:`${r.language!=='text'?`<button class="primary" data-open-code="${escape(r.path)}">${icon('play')}Laboratuvarda aç</button>`:''}<button data-download-source="${escape(r.path)}">${icon('download')}Dosyayı indir</button>`}</div>${r.pages?`<p class="note" style="margin-bottom:12px">${r.pageCount} sayfa · Metin önizlemesi. Şekilleri ve kod yerleşimini PDF’den incele.</p><pre>${escape(r.pages.map((p,i)=>`── Sayfa ${i+1} ──\n${p}`).join('\n\n'))}</pre>`:`${r.path.startsWith('Lecture06/')&&r.name.startsWith('process')?'<p class="note">Bu süreç yönetimi örneği gerçek Linux gerektirebilir. Sanal Bash kabuğu job control / gerçek süreçleri desteklemez.</p>':''}<pre>${escape(r.content||'(boş dosya)')}</pre>`}`);}
function download(name,content,type='application/json'){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([content],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),5000);}
async function backup(){saveNow();download('bil214-yedek.json',JSON.stringify({version:1,preferences:prefs,workspace:labState,savedAt:new Date().toISOString()},null,2));toast('Yedek indirildi.');}
function showHelp(){modal(`<h2>Çalışma alanını kullan</h2><div class="help-content"><ul><li><b>Çalıştır</b> seçtiğin örneği veya kendi girdini çalıştırır. <b>Kontrol et</b> bütün testleri dener ve beklenen/oluşan farklarını gösterir.</li><li><b>C fonksiyon sorularında</b> main yazma; hazır test programı eklenir. Tam program sorularında ve serbest alanda main dahil kodu yaz.</li><li><b>stdin</b> scanf/read girdisidir. Argümanlar ise argv / $1, $2 alanlarına gider. Ek giriş istemleri otomatik testte çıktı farkı oluşturur.</li><li><b>Bash dosya ağacı</b> sanaldır. Bilgisayarının gerçek dosyalarına erişmez. Komutlar, dosyalar, dizinler ve değişkenlerle çalışabilirsin.</li><li><b>Sınırlar:</b> Bash, <a target="_blank" rel="noopener" href="https://github.com/vercel-labs/just-bash">just-bash</a> uyumlu yorumlayıcısıdır; gerçek Linux süreçleri, job control ve ağ erişimi yoktur. C, <a target="_blank" rel="noopener" href="https://github.com/binji/wasm-clang">Clang/LLD WebAssembly</a> kullanır; wasm32 boyutları bilgisayarından farklı olabilir.</li><li><b>Doğru sonucu</b> test edilen çıktının/dosyaların doğru olduğu anlamına gelir. O(n), değişken sayısı, izinli komutlar gibi sınav kuralları otomatik notlandırılmaz.</li><li>Kodlar ve ilerleme tarayıcıda, dosyalar IndexedDB’de tutulur. Başka cihazla eşitlenmez. <b>Yedekle</b> ile dışarı aktarabilirsin.</li><li>Ctrl + Enter: çalıştır. Ctrl + S: kaydet. Terminalde ↑ / ↓: komut geçmişi. Durdur, sonsuz döngüyü keser.</li></ul><div class="modal-actions"><button data-action="backup">${icon('download')}Yedek indir</button><button data-action="import">${icon('upload')}Yedekten geri yükle</button></div><p class="note">Ders kaynakları: TOBB ETÜ BİL214, 2026 Güz. Bu atölye kişisel çalışma aracıdır.</p></div>`);}
async function navigate(next){saveNow();cancel();view=next;output=null;outputTab='output';persist();render();if(view==='lab'&&labLanguage==='bash'){try{await ensureLab();renderTree();}catch(e){toast(e.message);}}}
function selectQuestion(id){saveNow();cancel();qid=id;view='questions';selectedTest=0;questionTree=null;output=null;outputTab='output';persist();render();$('#question-list .active')?.scrollIntoView({block:'nearest'});}
document.addEventListener('click',async e=>{
  const b=e.target.closest('button,a');if(!b)return;
  if(b.dataset.view){await navigate(b.dataset.view);return;}
  if(b.dataset.question){selectQuestion(b.dataset.question);return;}
  if(b.dataset.filter){languageFilter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>x.classList.toggle('active',x===b));renderList();return;}
  if(b.dataset.output){outputTab=b.dataset.output;renderOutput();return;}
  if(b.dataset.resource){showResource(b.dataset.resource);return;}
  if(b.dataset.downloadSource){const r=materials.examples.find(x=>x.path===b.dataset.downloadSource);download(r.name,r.content,'text/plain;charset=utf-8');return;}
  if(b.dataset.openCode){
    const r=materials.examples.find(x=>x.path===b.dataset.openCode);saveNow();cancel();view='lab';labLanguage=r.language;labPath='/home/ogrenci/ders/'+r.path;labCFiles={};
    const dir=r.path.slice(0,r.path.lastIndexOf('/')+1);
    for(const f of materials.examples.filter(x=>x.path.startsWith(dir)&&x.name.endsWith('.h')))labCFiles[f.path.slice(dir.length)]=f.content;
    prefs.drafts['lab-'+labLanguage]={code:r.content,stdin:'',args:''};output=null;terminalLog=[];$('#modal').close();persist();render();if(labLanguage==='bash'){try{await ensureLab();renderTree();}catch(e){toast(e.message);}}return;
  }
  if(b.dataset.tree){
    if(b.dataset.kind==='directory'){if(b.dataset.tree==='lab'){const p=b.dataset.path;treeExpanded.has(p)?treeExpanded.delete(p):treeExpanded.add(p);renderTree();}return;}
    const entries=b.dataset.tree==='lab'?labState?.entries:questionTree||current().tests[0].before;
    const f=entries?.find(x=>x.path===b.dataset.path);if(!f)return;
    if(b.dataset.tree==='lab'&&f.type==='file'){saveNow();labPath=f.path;replaceCode(prefs.fileDrafts?.[f.path]??f.content??'');$('#editor-filename').textContent=labPath;persist();renderTree();}
    else modal(`<h2>${escape(f.path.split('/').at(-1))}</h2><p class="source-path">${escape(f.path)}</p><pre>${escape(f.content??f.target??'(boş)')}</pre>`);return;
  }
  switch(b.dataset.action){
    case 'answer-key':showAnswer();break;
    case 'copy-answer':await copyAnswer(b.dataset.answerId);break;
    case 'theme':prefs.theme=document.documentElement.dataset.theme==='dark'?'light':'dark';applyTheme();persist();break;
    case 'menu':$('#sidebar')?.classList.toggle('open');break;
    case 'run':await runCode(false);break;
    case 'grade':await runCode(true);break;
    case 'stop':cancel();break;
    case 'todo':onlyTodo=!onlyTodo;b.textContent=onlyTodo?'Tüm soruları göster':'Yalnızca çözülmeyenler';b.classList.toggle('secondary',onlyTodo);renderList();break;
    case 'previous':selectQuestion(questions[Math.max(0,questions.indexOf(current())-1)].id);break;
    case 'next':selectQuestion(questions[Math.min(questions.length-1,questions.indexOf(current())+1)].id);break;
    case 'reset-code':modal('<h2>Kodu başlangıca döndür</h2><p>Bu editördeki taslağın başlangıç koduyla değiştirilecek.</p><button class="primary" data-action="confirm-reset-code">Başlangıca döndür</button>');break;
    case 'confirm-reset-code':replaceCode(view==='lab'?(labLanguage==='bash'?bashDefault:cDefault):current().starter);$('#modal').close();toast('Başlangıç kodu yüklendi.');break;
    case 'save-file':await saveFile();break;
    case 'new-file':modal(`<h2>Yeni dosya</h2><label for="new-path">Dosyanın tam yolu</label><input class="file-path-input" id="new-path" value="${escape((labState?.cwd||'/home/ogrenci')+'/yeni.sh')}"><button class="primary" data-action="create-file">Oluştur ve aç</button>`);break;
    case 'create-file':{const p=$('#new-path').value.trim();if(!p||p.includes('\0')){toast('Geçerli bir dosya yolu yaz.');break;}if(busy)break;saveNow();setBusy(true);try{await ensureLab();const r=await bashRuntime.request({type:'write',path:p,content:'',createOnly:true});await acceptLab(r);labPath=r.path;replaceCode('');$('#editor-filename').textContent=labPath;renderTree();$('#modal').close();}catch(e){toast(e.message);}finally{setBusy(false);}break;}
    case 'refresh-tree':try{await ensureLab();renderTree();}catch(e){toast(e.message);}break;
    case 'clear-terminal':terminalLog=[];renderTerminal();break;
    case 'reset-lab':modal('<h2>Çalışma alanını sıfırla</h2><p>Sanal dosyaların silinip ders dosyaları yeniden yüklenecek. İlerlemen ve soru çözümlerin korunur.</p><div class="modal-actions"><button data-action="backup">Önce yedek indir</button><button class="danger" data-action="confirm-reset-lab">Dosya alanını sıfırla</button></div>');break;
    case 'confirm-reset-lab':cancel();bashRuntime.stop();labState=null;labReady=false;labPath='/home/ogrenci/calisma.sh';terminalLog=[];terminalHistory=[];prefs.fileDrafts={};delete prefs.drafts['lab-bash'];$('#modal').close();await ensureLab();persist();render();toast('Dosya alanı sıfırlandı.');break;
    case 'backup':await backup();break;
    case 'export-workspace':saveNow();download('bil214-dosyalar.json',JSON.stringify({version:1,workspace:labState,preferences:prefs},null,2));break;
    case 'help':showHelp();break;
    case 'import':$('#import-file').click();break;
  }
});
document.addEventListener('input',e=>{if(e.target.id==='question-search'){search=e.target.value;renderList();}else if(e.target.id==='resource-search'){resourceSearch=e.target.value;renderResources();}else if(['stdin','args'].includes(e.target.id))saveDraft();});
document.addEventListener('change',async e=>{
  if(e.target.id==='lab-language'){saveNow();cancel();labLanguage=e.target.value;output=null;persist();render();if(labLanguage==='bash'){try{await ensureLab();renderTree();}catch(e){toast(e.message);}}}
  if(e.target.id==='sample-test')selectedTest=Number(e.target.value);
  if(e.target.id==='resource-filter'){resourceFilter=e.target.value;renderResources();}
  if(e.target.id==='import-file'){
    try{const file=e.target.files[0];if(!file)return;if(file.size>15000000)throw Error('Yedek 15 MB sınırını aşıyor.');const data=JSON.parse(await file.text());if(data.version!==1||!data.preferences||typeof data.preferences.drafts!=='object'||!Array.isArray(data.workspace?.entries??[]))throw Error('Geçerli bir BİL214 yedeği değil.');
      for(const x of data.workspace?.entries||[])if(typeof x.path!=='string'||!x.path.startsWith('/')||!['file','directory','symlink'].includes(x.type))throw Error('Geçersiz dosya kaydı.');
      window.__bil214PendingImport=data;modal('<h2>Yedeği geri yükle</h2><p>Mevcut taslakların, ilerlemen ve sanal dosyaların seçtiğin yedekle değiştirilecek.</p><button class="primary" id="confirm-import">Geri yükle</button>');
      $('#confirm-import').onclick=async()=>{cancel();bashRuntime.stop();prefs=data.preferences;prefs.drafts??={};prefs.progress??={};labState=data.workspace;labReady=false;labPath=prefs.labPath||'/home/ogrenci/calisma.sh';labLanguage=prefs.labLanguage==='c'?'c':'bash';qid=questions.some(q=>q.id===prefs.qid)?prefs.qid:'c3-1';view='questions';await saveWorkspace(labState);persist();$('#modal').close();output=null;render();toast('Yedek geri yüklendi.');};
    }catch(err){toast(err.message);}e.target.value='';
  }
});
document.addEventListener('submit',e=>{if(e.target.id==='terminal-form'){e.preventDefault();const input=$('#terminal-command'),command=input.value;input.value='';terminal(command);}});
document.addEventListener('keydown',e=>{if(e.target.id==='terminal-command'&&['ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();historyIndex=Math.max(0,Math.min(terminalHistory.length,historyIndex+(e.key==='ArrowUp'?-1:1)));e.target.value=terminalHistory[historyIndex]||'';}});
window.addEventListener('beforeunload',()=>saveNow());
applyTheme();
systemTheme.addEventListener('change',()=>{if(!['light','dark'].includes(prefs.theme))applyTheme();});
try{
  const responses=await Promise.all([fetch(url('data/questions.json'),{cache:'no-cache'}),fetch(url('data/materials.json'),{cache:'no-cache'})]);
  if(responses.some(r=>!r.ok))throw Error('Ders içerikleri yüklenemedi.');
  [questions,materials]=await Promise.all(responses.map(r=>r.json()));
  if(!questions.some(q=>q.id===qid))qid=questions[0].id;
  try{labState=await readWorkspace();}catch{toast('Kalıcı dosya kaydı kullanılamıyor; yedek indirmeyi unutma.');}
  render();if(view==='lab'&&labLanguage==='bash'){await ensureLab();renderTree();}
  if('serviceWorker'in navigator)navigator.serviceWorker.register(url('sw.js'),{scope:base.pathname}).catch(()=>{});
}catch(e){$('#app').innerHTML=`<div class="initial-loader"><h1>Çalışma alanı açılamadı</h1><p>${escape(e.message)}</p><p>Siteyi GitHub Pages veya yerel HTTP sunucusu üzerinden aç.</p><button onclick="location.reload()">Yeniden dene</button></div>`;}
