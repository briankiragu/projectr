const cacheName = 'projectr-v1.0.0';
const appShellFiles = ['/logo.webp'];

self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
  e.waitUntil(
    (async () => {
      const cache = await caches.open(cacheName);
      console.log('[Service Worker] Caching all: app shell and content');
      await cache.addAll([...appShellFiles]);
    })()
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key === cacheName) {
            return;
          }
          return caches.delete(key);
        })
      );
    })
  );
});

// self.addEventListener('fetch', (e) => {
//   e.respondWith(
//     (async () => {
//       const r = await caches.match(e.request);
//       console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
//       if (r) {
//         return r;
//       }
//       const response = await fetch(e.request);
//       const cache = await caches.open(cacheName);
//       console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
//       cache.put(e.request, response.clone());
//       return response;
//     })()
//   );
// });

self.addEventListener('fetch', (event) => {
  console.dir(event.request);
  event.respondWith(
    caches.open(cacheName).then(async (cache) => {
      const cachedResponse = await cache.match(event.request);
      const fetchedResponse = fetch(event.request).then((networkResponse) => {
        cache.put(event.request, networkResponse.clone());

        return networkResponse;
      });

      if (cachedResponse) {
        console.log('Cached response');
      }
      if (fetchedResponse) {
        console.log('Fetched response');
      }

      return cachedResponse || fetchedResponse;
    })
  );
});
