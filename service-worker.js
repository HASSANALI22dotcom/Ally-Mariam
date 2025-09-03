// Version ya cache
const CACHE_NAME = "ukoo-cache-v1";

// Files za kucache
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/assets/android-chrome-192x192.png",
  "/assets/android-chrome-512x512.png",
  "/assets/apple-touch-icon.png",
  "/assets/favicon.ico"
];

// Install Service Worker na kuweka cache
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("📦 Caching app shell...");
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate Service Worker na kufuta cache za zamani
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log("🗑️ Deleting old cache:", cache);
            return caches.delete(cache);
          }
        })
      )
    )
  );
});

// Fetch Requests (offline support)
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Kama iko cached → rudisha cache, la sivyo fetch mtandaoni
      return response || fetch(event.request);
    })
  );
});