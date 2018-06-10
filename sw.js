// sw.js

const cacheName = 'v26';
const filesToCache = [
    'sw.js',
    './',
    './index.html',
    './css/styles.css',
    './js/dbhelper.js',
    './js/main.js',
    './js/restaurant_info.js',
    './js/manifest.json',
    './js/echo.min.js',
    './restaurant.html',
    './lib/idb.js'
];

self.addEventListener("install", function (event) {
    // Perform install steps
    console.log("[Servicework] Install");
    event.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log("[ServiceWorker] Caching app shell");
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener("activate", function (event) {
    console.log("[Servicework] Activate");
    event.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== cacheName) {
                    console.log("[ServiceWorker] Removing old cache shell", key);
                    return caches.delete(key);
                }
            }));
        })
    );
});

//fetch event - it caches all of the network requests
self.addEventListener('fetch', (event) => {
    console.info('Event: Fetch');

    var request = event.request;

    //Tell the browser to wait for newtwork request and respond with below
    event.respondWith(
        //If request is already in cache, return it
        caches.match(request).then((response) => {
            if (response) {
                return response;
            }

            //if request is not cached, add it to cache
            return fetch(request).then((response) => {
                var responseToCache = response.clone();
                caches.open(cacheName).then((cache) => {
                    cache.put(request, responseToCache);
                });

                return response;
            });
        })
    );
});

/* Resources
    https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker-slides 
    https://www.youtube.com/watch?v=BfL3pprhnms
    https://github.com/GoogleChromeLabs/sw-toolbox/issues/227
*/