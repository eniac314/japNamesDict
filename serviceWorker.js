const channel = new BroadcastChannel('sw-messages');

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
            channel.postMessage('[install] Caches opened, adding all core components');
            return cache.addAll(urlsToCache);
        })
        .then(function() {
            channel.postMessage('[install] All required resources have been cached');
            return self.skipWaiting();
        })
    )
})

addEventListener("fetch", function (event) {
    channel.postMessage('Service Worker Intercept: ' + event.request.url);
    event.respondWith(caches.match(event.request).then(function (response) {
        return response || fetch(event.request);
    }))
})