addEventListener("install", function (event) {
    event.waitUntil(caches.open("elm-pwa-v1").then(function (cache) {
        return cache.addAll([
            "/",
            "/index.html",
            "/js/main.js",
            "/favicon.ico",
            "/manifest.json"
        ])
    }))
})

addEventListener("fetch", function (event) {
    console.log('Service Worker Intercept: ' + event.request.url);
    event.respondWith(caches.match(event.request).then(function (response) {
        return response || fetch(event.request)
    }))
})