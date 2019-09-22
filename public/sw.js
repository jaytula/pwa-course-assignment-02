const appShellList = [
  "https://fonts.googleapis.com/css?family=Roboto:400,700",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
  "https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css",
  "/src/css/app.css",
  "/src/css/main.css",
  "/src/js/material.min.js",
  "/src/js/main.js",
  "/"
];

const CACHE_STATIC = "static-v3";
const CACHE_DYNAMIC = "dynamic-v2";

self.addEventListener("install", event => {
  console.log("[Service Worker]: install");
  event.waitUntil(
    caches.open(CACHE_STATIC).then(cache => {
      return cache.addAll(appShellList);
    })
  );
});

self.addEventListener("activate", event => {
  console.log("[Service Worker]: activate");
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function(cacheName) {
            return cacheName !== CACHE_STATIC && cacheName !== CACHE_DYNAMIC;
          })
          .map(function(cacheName) {
            return caches.delete(cacheName);
          })
      );
    })
  );
});

self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches.match(event.request).then(response => {
      return (
        response ||
        fetch(event.request).then(() => {
          caches.open(CACHE_DYNAMIC).then(cache => {
            return cache.add(event.request);
          });
        })
      );
    })
  );
});
