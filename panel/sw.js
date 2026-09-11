const CACHE_NAME = 'silveriom-dynamic-cache-v1';

// Install Event: Takes over immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Network-First Strategy for HTML/JS/CSS to ensure latest updates
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Apply only to our own assets
  if (url.origin === location.origin) {
    const isAsset = url.pathname.endsWith('.js') || url.pathname.endsWith('.css') || url.pathname.endsWith('.html');
    
    if (isAsset) {
      event.respondWith(
        fetch(event.request)
          .then((networkResponse) => {
            // If network fetch is successful and valid, clone to cache and return
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            // Offline fallback: Use the cached version
            return caches.match(event.request);
          })
      );
      return;
    }
  }
  
  // Default behavior for other requests
  event.respondWith(fetch(event.request));
});
