const STATIC_CACHE_NAME = 'static-cache-v1.2';
const INMUTABLE_CACHE_NAME = 'inmutable-cache-v1.1';
const DYNAMIC_CACHE_NAME = 'dynamic-cache-v1.1';


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
      '/',
      '/index.html',
      '/style/base.css',
      '/style/bg.png',
      '/style/plain_sign_in_blue.png',
      '/-pwa-gustavo/images/icons/android-launchericon-96-96.png',
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