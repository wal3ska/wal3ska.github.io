const KEY='bil214:v1';
export function readPreferences(){try{return JSON.parse(localStorage.getItem(KEY))||{};}catch{return {};}}
export function savePreferences(data){localStorage.setItem(KEY,JSON.stringify(data));}
let dbPromise;
function db(){return dbPromise??=new Promise((resolve,reject)=>{
  const r=indexedDB.open('bil214-workspace',1);
  r.onupgradeneeded=()=>r.result.createObjectStore('state');
  r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);
});}
export async function readWorkspace(){const d=await db();return new Promise((resolve,reject)=>{const r=d.transaction('state').objectStore('state').get('lab');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
export async function saveWorkspace(state){const d=await db();return new Promise((resolve,reject)=>{const t=d.transaction('state','readwrite');t.objectStore('state').put(state,'lab');t.oncomplete=resolve;t.onerror=()=>reject(t.error);});}
