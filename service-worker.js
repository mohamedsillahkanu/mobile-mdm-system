const CACHE_NAME = 'mdm-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/mdm-styles.css',
  '/js/mdm-data.js',
  '/js/mdm-ui.js',
  '/js/mdm-app.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
