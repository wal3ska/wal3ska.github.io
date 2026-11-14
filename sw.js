// Only immutable compiler assets are cached. Application/data updates stay fresh.
const CACHE='bil214-compiler-v1';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(u.origin!==location.origin||!u.pathname.includes('/vendor/clang/'))return;
  e.respondWith(caches.open(CACHE).then(async c=>{
    const saved=await c.match(e.request);if(saved)return saved;
    const response=await fetch(e.request);if(response.ok)await c.put(e.request,response.clone());return response;
  }));
});
