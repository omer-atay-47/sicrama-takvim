// plan.json her zaman ağdan (yoksa önbellek); diğerleri önbellekten, arkada yenilenir.
const C = "takvim-v3";
self.addEventListener("install", (e) => { e.waitUntil(caches.open(C).then((c) => c.addAll(["./", "index.html", "manifest.json", "icon-192.png"]))); self.skipWaiting(); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((k) => Promise.all(k.filter((x) => x !== C).map((x) => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET" || /\/videolar\//.test(e.request.url)) return;
  const net = fetch(e.request).then((r) => { const cp = r.clone(); caches.open(C).then((c) => c.put(e.request, cp)); return r; });
  e.respondWith(/plan\.json/.test(e.request.url) ? net.catch(() => caches.match(e.request)) : caches.match(e.request).then((m) => m || net));
});
