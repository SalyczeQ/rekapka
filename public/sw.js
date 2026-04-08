const CACHE_NAME = 'rekapka-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Don't intercept navigation requests — breaks Next.js streaming/Suspense
  if (event.request.mode === 'navigate') {
    return;
  }

  // Don't intercept API calls
  if (event.request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
