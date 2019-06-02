const staticCacheName = "site-static-v1";
const dynamicCacheName = "site-dynamic-v1";
const assets = [
  "/",
  "/offline.html",
  "/JS/bootstrap.min.js",
  "/JS/jquery.min.js",
  "/JS/popper.min.js",
  "/css/style.css",
  "/css/bootstrap.min.css",
  "/images/1.png",
  "/images/background.jpg",
  "/images/logo.png"
];

// install event
self.addEventListener("install", evt => {
  //console.log('service worker installed');
  evt.waitUntil(
    caches.open(staticCacheName).then(cache => {
      console.log("caching shell assets");
      return cache.addAll(assets);
      console.log(cache);
    })
  );
});

// activate event
self.addEventListener("activate", evt => {
  //console.log('service worker activated');
  evt.waitUntil(
    caches.keys().then(keys => {
      //console.log(keys);
      return Promise.all(
        keys
          .filter(key => key !== staticCacheName && key !== dynamicCacheName)
          .map(key => caches.delete(key))
      );
    })
  );
});

// fetch event
self.addEventListener("fetch", evt => {
  //console.log('fetch event', evt);
  evt.respondWith(
    fetch(evt.request)
      .catch(function() {
        return caches.match(evt.request).then(result => {
          return result || caches.match("/offline.html");
        })
      })
  )
});
