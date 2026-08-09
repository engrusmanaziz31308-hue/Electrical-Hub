const CACHE_NAME = 'electrical-hub-v7';
const ASSETS = [
  './',
  './index.html',
  './i18n.js',
  './data.js',
  './app.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first: always try to fetch the latest file from the server first.
// Only fall back to the cached copy if the network request fails (e.g. offline).
// This means every future update to index.html/app.js/etc. is picked up
// automatically the next time the app opens with an internet connection —
// no need to bump CACHE_NAME or ask users to clear app storage.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).then((response) => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(()=>{});
      return response;
    }).catch(() => caches.match(event.request))
  );
});
