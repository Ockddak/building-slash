// 빌딩 베기 오프라인 캐시. 게임을 고쳐서 다시 올릴 때는 아래 버전 숫자를 하나 올려 주세요.
const CACHE="building-slash-v7";
const SHELL=["./","index.html","manifest.webmanifest","fonts/Galmuri11-Bold.woff2","icon-192.png","icon-512.png","apple-touch-icon.png","privacy.html"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{});return r}).catch(()=>caches.match(e.request).then(m=>m||caches.match("index.html"))));
});
