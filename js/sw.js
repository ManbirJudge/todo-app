const CACHE_NAME = "v1";
const ASSETS = [  // everything to be cached
    "/",
    "/index.html",
    "/css/style.css",
    "/js/actions.js",
    "/js/db.js",
    "/js/dom.js",
    "/js/main.js",
    "/js/render.js",
    "/js/state.js",
    "/assets/fonts/GoogleSans.ttf",
    "/assets/icons/*",
    "/manifest.json"
];

self.addEventListener("install", evt => {
    evt.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener("fetch", evt => {
    evt.respondWith(
        caches.match(evt.request).then(resp => {
            return resp || fetch(evt.reques)
        })
    );
});
