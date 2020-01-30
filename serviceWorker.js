var logger;
try{
    console.log("BroadcastChannel is available in service Worker");
    const channel = new BroadcastChannel('sw-messages');
    logger = function(m){channel.postMessage(m)};
} catch {
    console.log("BroadcastChannel not available");
    logger = function(m){console.log(m)};
}
// if ('BroadcastChannel' in self){
//     console.log("BroadcastChannel is available in service Worker");
//     const channel = new BroadcastChannel('sw-messages');
//     logger = function(m){channel.postMessage(m)};
// } else {
//     console.log("BroadcastChannel not available");
//     logger = function(m){console.log(m)};
// }

var cacheName = "japdict";

var urlsToCache = [
            "/",
            "/index.html",
            "/js/main.js",
            "/favicon.ico",
            "/manifest.json"
        ];


addEventListener("install", function (event) {
    event.waitUntil(caches.open(cacheName)
        .then(function (cache) {
            logger('[install] Caches opened, adding all core components');
            return cache.addAll(urlsToCache);
        })
        .then(function() {
            logger('[install] All required resources have been cached');
            return self.skipWaiting();
        })
    )
})

addEventListener("fetch", function (event) {
    logger('Service Worker Intercept: ' + event.request.url);
    event.respondWith(caches.match(event.request).then(function (response) {
        return response || fetch(event.request);
    }))
})