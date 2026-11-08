// Keeps My Money working offline. Shows the saved copy at once, then checks GitHub for a newer version in the background.
var C="my-money-1.5";
self.addEventListener("install",function(e){ e.waitUntil(caches.open(C).then(function(c){ return c.addAll((["./","index.html","manifest.webmanifest","icon-180.png","icon-512.png","xlsx.full.min.js"].concat([400,500,600,700,800].map(function(w){ return "bricolage-grotesque-latin-"+w+"-normal.woff2"; }))).map(function(u){ return new Request(u,{cache:"reload"}); })); })); self.skipWaiting(); });
self.addEventListener("activate",function(e){ e.waitUntil(caches.keys().then(function(ks){ return Promise.all(ks.filter(function(k){ return k!==C; }).map(function(k){ return caches.delete(k); })); }).then(function(){ return self.clients.claim(); })); });
self.addEventListener("fetch",function(e){
  if(e.request.method!=="GET") return;
  e.respondWith(caches.open(C).then(function(c){
    return c.match(e.request,{ignoreSearch:true}).then(function(hit){
      var same=new URL(e.request.url).origin===self.location.origin;
      var net=fetch(same?new Request(e.request,{cache:"no-cache"}):e.request).then(function(r){ if(r && (r.ok || r.type==="opaque")) c.put(e.request,r.clone()); return r; }).catch(function(){ return hit; });
      return hit || net; }); })); });
