const V='promemoria-v2',FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));
});

// Rete prima, cache se offline. Le chiamate al database non passano da qui.
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET')return;
  if(u.origin!==location.origin&&u.hostname!=='cdn.jsdelivr.net')return;
  e.respondWith(
    fetch(r).then(res=>{
      if(res.ok){const c=res.clone();caches.open(V).then(ch=>ch.put(r,c))}
      return res;
    }).catch(()=>caches.match(r).then(x=>x||caches.match('./index.html')))
  );
});

// Notifica push inviata dal server all'ora del promemoria.
self.addEventListener('push',e=>{
  let d={};
  try{d=e.data?e.data.json():{}}catch(_){d={body:e.data?e.data.text():''}}
  e.waitUntil((async()=>{
    await self.registration.showNotification(d.title||'Promemoria',{
      body:d.body||'',
      tag:d.id||'promemoria',
      icon:'icon-192.png',
      badge:'icon-192.png',
      data:{id:d.id},
      requireInteraction:true,
      vibrate:[200,100,200]
    });
    const cl=await clients.matchAll({type:'window',includeUncontrolled:true});
    cl.forEach(c=>c.postMessage({type:'push',id:d.id}));
  })());
});

self.addEventListener('notificationclick',e=>{
  e.notification.close();
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(l=>l.length?l[0].focus():clients.openWindow('./index.html')));
});
