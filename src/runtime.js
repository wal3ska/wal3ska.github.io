export class Runtime {
  constructor(kind,onProgress=()=>{}){this.kind=kind;this.onProgress=onProgress;this.pending=null;this.worker=null;this.next=0;}
  start(){
    if(this.worker)return;
    this.worker=new Worker(new URL(this.kind==='c'?'./c-worker.js':'./bash-worker.js',import.meta.url),this.kind==='c'?{}:{type:'module'});
    this.worker.onmessage=({data})=>{
      if(data.type==='progress'){
        this.onProgress(data.message);
        if(this.pending){clearTimeout(this.pending.timer);this.pending.timer=setTimeout(()=>this.stop('Süre sınırı aşıldı. Sonsuz döngüyü veya eksik girdiyi kontrol et.'),data.message.startsWith('Çalıştırılıyor')?7000:60000);}
        return;
      }
      if(!this.pending||data.id!==this.pending.id)return;
      const p=this.pending;this.pending=null;clearTimeout(p.timer);
      data.error?p.reject(Error(data.error)):p.resolve(data);
    };
    this.worker.onerror=e=>this.stop(e.message||'Çalıştırma motoru yüklenemedi. Sayfayı yenile.');
  }
  request(payload){
    if(this.pending)return Promise.reject(Error('Önceki işlem hâlâ çalışıyor.'));
    this.start();
    return new Promise((resolve,reject)=>{
      const id=++this.next;
      this.pending={id,resolve,reject,timer:setTimeout(()=>this.stop('Süre sınırı aşıldı. Kodunu ve girdini kontrol et.'),this.kind==='c'?120000:12000)};
      this.worker.postMessage({...payload,id});
    });
  }
  stop(message='Çalıştırma durduruldu.'){
    this.worker?.terminate();this.worker=null;
    if(this.pending){clearTimeout(this.pending.timer);this.pending.reject(Error(message));this.pending=null;}
  }
}
