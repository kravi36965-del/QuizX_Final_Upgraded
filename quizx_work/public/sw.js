const CACHE="quizx-v3";
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(["/","/css/style.css","/manifest.webmanifest"]))));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener("fetch",e=>{if(e.request.method!=="GET"||e.request.url.includes("/socket.io/"))return;e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)))})
