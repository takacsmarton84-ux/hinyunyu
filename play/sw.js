// Generálva a build során (vite.config.ts).
const CACHE = 'space-race-d7b190ec3374'
const PRECACHE = ["./","./assets/index-BTswf2pL.css","./assets/index-CJXfSXiW.js","./icons/apple-touch-icon.png","./icons/favicon-32.png","./icons/icon-192.png","./icons/icon-512.png","./img/coin-bronze.webp","./img/coin-gold.webp","./img/coin-silver.webp","./img/logo.webp","./img/meteor-1.webp","./img/meteor-2.webp","./img/meteor-3.webp","./img/ufo.webp","./manifest.webmanifest","./sounds/explosion.wav","./sounds/music.wav","./sounds/pling.wav"]

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith('space-race-') && key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return
  event.respondWith((async () => {
    const cache = await caches.open(CACHE)
    if (request.mode === 'navigate') {
      // Az oldal: a hálózatról, ha elérhető (frissítés), különben a cache-ből.
      try {
        return await fetch(request)
      } catch {
        return (await cache.match('./', { ignoreVary: true })) ?? Response.error()
      }
    }
    return (await cache.match(request, { ignoreSearch: true, ignoreVary: true })) ?? fetch(request)
  })())
})
