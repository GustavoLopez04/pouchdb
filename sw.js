const STATIC_CACHE_NAME = 'static-cache-v1.2';
const INMUTABLE_CACHE_NAME = 'inmutable-cache-v1.1';
const DYNAMIC_CACHE_NAME = 'dynamic-cache-v1.1';
const ROOT_PATH = "pouchdb"


const cleanCache = (cacheName, limitItems) => {
  caches.open(cacheName).then((cache) => {
    return cache.keys().then((keys) => {
      if (keys.length > limitItems) {
        cache.delete(keys[0]).then(cleanCache(cacheName, limitItems));
      }
    });
  });
};


self.addEventListener('install', (event) => {
  const respCache = caches.open(STATIC_CACHE_NAME).then((cache) => {
    return cache.addAll([
     '/pouchdb/',
      '/pouchdb/index.html',
      '/pouchdb/style/base.css',
      '/pouchdb/style/bg.png',
      '/pouchdb/style/plain_sign_in_blue.png',
      '/pouchdb/images/icons/android-launchericon-72-72.png',
      '/pouchdb/images/icons/android-launchericon-96-96.png',
      '/pouchdb/images/icons/android-launchericon-144-144.png',
      '/pouchdb/images/icons/android-launchericon-192-192.png',
      '/pouchdb/images/icons/android-launchericon-512-512.png',
      '/pouchdb/manifest.json',
    ]);
  });
  const respCacheInmutable = caches.open(INMUTABLE_CACHE_NAME).then((cache) => {
    return cache.addAll([
      'https://cdn.jsdelivr.net/npm/pouchdb@7.3.1/dist/pouchdb.min.js',

    ]);
  });

  event.waitUntil(Promise.all([respCache, respCacheInmutable]));
});


self.addEventListener('activate', (event) =>{
    const proDelete = caches.keys().then(cachesItems =>{

      cachesItems.forEach(element =>{
        if(element !== STATIC_CACHE_NAME && element.includes('static')){
          return caches.delete(element)
        }
      })

    })

    event.waitUntil(Promise.all([proDelete]));
})

self.addEventListener('fetch', (event) => {
  const resp = caches.match(event.request).then((respCache) => {
    if (respCache) {
      return respCache;
    }
    return fetch(event.request).then((respWeb) => {
      caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
        cache.put(event.request, respWeb);
        cleanCache(DYNAMIC_CACHE_NAME, 10);
      });
      return respWeb.clone();
    }).catch((err) => {
    
    });
  });
  event.respondWith(resp);
});
