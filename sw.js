const V='daymarck-v24',FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable-512.png','./favicon-32.png','./favicon.ico','./avatar.png','./bg.webp'];

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
    }).catch(()=>caches.match(r,{ignoreSearch:true}).then(x=>x||caches.match('./index.html')))
  );
});

// Notifica push inviata dal server all'ora del promemoria.
self.addEventListener('push',e=>{
  let d={};
  try{d=e.data?e.data.json():{}}catch(_){d={body:e.data?e.data.text():''}}
  e.waitUntil((async()=>{
    await self.registration.showNotification(d.title||'DayMarck',{
      body:d.body||'',
      tag:d.kind==='support'?'support':(d.aid||d.id||'daymarck'),
      icon:'icon-192.png',
      badge:'icon-192.png',
      data:{id:d.id,aid:d.aid,kind:d.kind},
      requireInteraction:true,
      vibrate:[200,100,200]
    });
    const cl=await clients.matchAll({type:'window',includeUncontrolled:true});
    cl.forEach(c=>c.postMessage({type:'push',id:d.id}));
  })());
});

// Toccando la notifica si apre la nota a schermo intero.
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  const id=e.notification.data&&e.notification.data.id,kind=(e.notification.data&&e.notification.data.kind)||'remind',aid=e.notification.data&&e.notification.data.aid;
  if(kind==='support'){
    e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(l=>{
      if(l.length){l[0].postMessage({type:'open-support'});return l[0].focus()}
      return clients.openWindow('./index.html?support=1');
    }));
    return;
  }
  const url='./index.html'+(id?'?note='+encodeURIComponent(id)+'&k='+encodeURIComponent(kind)+(aid?'&a='+encodeURIComponent(aid):''):'');
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(l=>{
    if(l.length){
      const c=l[0];
      if(id)c.postMessage({type:'open-note',id,kind,aid});
      return c.focus();
    }
    return clients.openWindow(url);
  }));
});
