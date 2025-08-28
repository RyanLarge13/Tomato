const CACHE_NAME = "pomodoro-cache-v1";
const urlsToCache = [
  "/",
  "index.html",
  "load.html",
  "load.css",
  "load.js",
  "style.css",
  "script.js",
  "modal.css",
  "public/icons/192x192.png",
  "public/icons/512x512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
