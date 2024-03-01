const cacheName = "projectr-v1.0.3";
const appShellFiles = [
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200",

  "/favicons/favicon-32x32.png",
  "/favicons/favicon-16x16.png",

  "/favicons/android-chrome-36x36.png",
  "/favicons/android-chrome-48x48.png",
  "/favicons/android-chrome-72x72.png",
  "/favicons/android-chrome-96x96.png",
  "/favicons/android-chrome-144x144.png",
  "/favicons/android-chrome-192x192.png",
  "/favicons/android-chrome-256x256.png",
  "/favicons/android-chrome-384x384.png",
  "/favicons/android-chrome-512x512.png",

  "/browserconfig.xml",
  "/favicons/mstile-70x70.png",
  "/favicons/mstile-144x144.png",
  "/favicons/mstile-150x150.png",
  "/favicons/mstile-310x310.png",
  "/favicons/mstile-310x150.png",

  "/images/long.png",
  "/images/wide.png",

  "/logo.webp",
  "/apple-touch-icon.png",
  "/safari-pinned-tab.svg",
];

self.addEventListener("install", (e) => {
  console.info("[Service Worker] Install...");
  e.waitUntil(
    (async () => {
      const cache = await caches.open(cacheName);
      console.info("[Service Worker] Caching all...");
      await cache.addAll([...appShellFiles]);
    })()
  );
});

self.addEventListener("activate", (e) => {
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

/* Network-first cache */
self.addEventListener("fetch", (e) => {
  // Open the cache
  e.respondWith(caches.open(cacheName).then(async (cache) => {
    // Go to the network first
    try {
      const fetchedResponse = await fetch(e.request);
      cache.put(e.request, fetchedResponse.clone());
      return fetchedResponse;
    } catch {
      return await cache.match(e.request.url);
    }
  }));
});

/* State-while-revalidate cache */
// self.addEventListener("fetch", (e) => {
//   e.respondWith(
//     caches.open(cacheName).then(async (cache) => {
//       console.info(`[Service Worker] Fetching resource: ${e.request.url}...`);
//
//       const cachedResponse = await cache.match(e.request);
//       const fetchedResponse = fetch(e.request).then((networkResponse) => {
//         cache.put(e.request, networkResponse.clone());
//
//         return networkResponse;
//       });
//
//       return cachedResponse || fetchedResponse;
//     })
//   );
// });
