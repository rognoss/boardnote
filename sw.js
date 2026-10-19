const V='boardnote-v1.2-a6afc7';
const FILES=['./','index.html','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(FILES.map(f=>fetch(new Request(f,{cache:'reload'})).then(r=>{if(!r.ok) throw new Error(f); return c.put(f,r);})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
function fresh(req){ const ctl=new AbortController(); const t=setTimeout(()=>ctl.abort(),3500);
  return fetch(req,{cache:'no-cache',signal:ctl.signal}).then(r=>{clearTimeout(t); if(r.ok){ const c=r.clone(); caches.open(V).then(x=>x.put('index.html',c)); } return r;}); }
self.addEventListener('fetch',e=>{ const req=e.request; if(req.method!=='GET') return;
  if(req.mode==='navigate'){ e.respondWith(fresh(req).catch(()=>caches.match('index.html'))); return; }
  e.respondWith(caches.match(req,{ignoreSearch:true}).then(r=>r||fetch(req)));});
