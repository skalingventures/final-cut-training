const CACHE = "final-cut-v8";
const ASSETS = [
  "./",
  "./index.html",
  "./ds/tokens/index.css",
  "./ds/tokens/color.css",
  "./ds/tokens/type.css",
  "./ds/tokens/space.css",
  "./ds/tokens/radius.css",
  "./ds/tokens/shadow.css",
  "./ds/tokens/motion.css",
  "./ds/tokens/semantic.css",
  "./ds/primitives/a11y.css",
  "./ds/primitives/rule.css",
  "./ds/primitives/mark.css",
  "./ds/primitives/button.css",
  "./ds/primitives/card.css",
  "./ds/primitives/tile.css",
  "./ds/primitives/badge.css",
  "./ds/primitives/table.css",
  "./ds/primitives/disclosure.css",
  "./ds/primitives/field.css",
  "./ds/primitives/input.css",
  "./ds/primitives/check.css",
  "./styles.css",
  "./core.js",
  "./app.js",
  "./program.js",
  "./manifest.webmanifest",
  "./icons/icon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(cache =>
      Promise.allSettled(ASSETS.map(url => cache.add(url)))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("message", event => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  const dest = event.request.destination;
  const networkFirst = dest === "document" || dest === "script" || dest === "" ||
    /index\.html|app\.js|core\.js|program\.js$/.test(url.pathname);
  if (networkFirst) {
    event.respondWith(
      fetch(event.request).then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, copy));
        }
        return res;
      }).catch(() => caches.match(event.request).then(c => c || caches.match("./index.html")))
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then(cached => {
      const fetched = fetch(event.request).then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, copy));
        }
        return res;
      }).catch(() => cached);
      return cached || fetched;
    })
  );
});
