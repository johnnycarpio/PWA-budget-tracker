const appPrefix = 'budget-tracker-'
const version = 'version_01'
const cacheName = appPrefix + version;

const filesList = [
  "/",
  "/index.html",
  "/manifest.json",
  "/css/styles.css",
  "/icons/icon-512x512.png",
  "/icons/icon-384x384.png",
  "/icons/icon-192x192.png",
  "/icons/icon-152x152.png",
  "/icons/icon-144x144.png",
  "/icons/icon-128x128.png",
  "/icons/icon-96x96.png",
  "/icons/icon-72x72.png",
  "/js/idb.js",
  "/js/index.js"
];

self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('installing cache : ' + cacheName)
            return cache.addAll(filesList)
        })
    )
})

self.addEventListener('fetch', function (e) {
  console.log('fetch request : ' + e.request.url)
  e.respondWith(
      caches.match(e.request).then(function (request) {
          if (request) {
              console.log('responding with cache : ' + e.request.url)
              return request
          } else { 
              console.log('file is not cached, fetching : ' + e.request.url)
              return fetch(e.request)
          }
      })
  )
})

self.addEventListener('activate', function (e) {
  e.waitUntil(
      caches.keys().then(function (keyList) {
          let cacheKeeplist = keyList.filter(function (key) {
              return key.indexOf(appPrefix);
          })
          
          cacheKeeplist.push(cacheName);

          return Promise.all(keyList.map(function (key, i) {
              if (cacheKeeplist.indexOf(key) === -1) {
                  console.log('deleting cache : ' + keyList[i]);
                  return caches.delete(keyList[i]);
              }
          }));
      })
  );
});
