const CACHE_NAME = "daily-task-v7.3.0"; // 🔥 GANTI SETIAP UPDATE
const BASE = "/daily-task/";

const CORE_ASSETS = [
  BASE,
  BASE + "index.html",
  BASE + "manifest.json",
  BASE + "service-worker.js"
];

/* ===== INSTALL ===== */
self.addEventListener("install", event => {
 event.waitUntil(
  caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS))
 );
 self.skipWaiting();
});

/* ===== ACTIVATE ===== */
self.addEventListener("activate", event => {
 event.waitUntil(
  caches.keys().then(keys =>
   Promise.all(
    keys
     .filter(k => k !== CACHE_NAME)
     .map(k => caches.delete(k))
   )
  )
 );
 self.clients.claim();
});

/* ===== FETCH (Network First) ===== */
self.addEventListener("fetch", event => {
 const req = event.request;

 if (req.method !== "GET") return;

 // hanya handle request di folder app
 if (!req.url.includes("/daily-task/")) return;

 event.respondWith(
  fetch(req)
   .then(res => {
    const clone = res.clone();
    caches.open(CACHE_NAME).then(c => c.put(req, clone));
    return res;
   })
   .catch(() =>
    caches.match(req).then(r => r || caches.match(BASE + "index.html"))
   )
 );
});
