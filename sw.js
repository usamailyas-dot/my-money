// Keeps My Money working offline. Shows the saved copy at once, then updates it in the background.
var C="my-money-1.1";
self.addEventListener("install",function(e){ e.waitUntil(caches.open(C).then(function(c){ return c.addAll(["./","index.html","manifest.webmanifest","icon-180.png","icon-512.png","xlsx.full.min.js"].concat([400,500,600,700,800].map(function(w){ return "bricolage-grotesque-latin-"+w+"-normal.woff2"; }))); })); self.skipWaiting(); });
self.addEventListener("activate",function(e){ e.waitUntil(caches.keys().then(function(ks){ return Promise.all(ks.filter(function(k){ return k!==C; }).map(function(k){ return caches.delete(k); })); }).then(function(){ return self.clients.claim(); })); });
self.addEventListener("fetch",function(e){
  if(e.request.method!=="GET") return;
  e.respondWith(caches.open(C).then(function(c){
    return c.match(e.request,{ignoreSearch:true}).then(function(hit){
      var net=fetch(e.request).then(function(r){ if(r && (r.ok || r.type==="opaque")) c.put(e.request,r.clone()); return r; }).catch(function(){ return hit; });
      return hit || net; }); })); });
