const cachePrefix = 'arlodjie-static-' + new URL(self.registration.scope).pathname + '-'
const cacheName = cachePrefix + 'v3'
const files = [
  'index.html','styles.css','banner.css','image-file.js','photo-storage.js','banner.js','prototype.js','pwa.js',
  'app.webmanifest','logo.svg','lockup.svg','assets/app-192.png','assets/app-512.png',
  'assets/dm-sans.woff2','assets/cormorant-garamond.woff2',
  'assets/alpinist.png','assets/f91w.jpg','assets/field.jpg','assets/gshock.png','assets/hero.jpg',
  'assets/leather.jpg','assets/murph-front.jpg','assets/murph.jpg','assets/presage.jpg','assets/prx.jpg',
  'assets/shunbun-dial.jpg','assets/shunbun.png','assets/srpe55.jpg','assets/steel.jpg'
]
const urls = new Set(files.map(file => new URL(file,self.registration.scope).href))
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(cacheName)
    await cache.addAll([...urls].map(url => new Request(url,{cache:'reload'})))
    await self.skipWaiting()
  })())
})
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys()
    await Promise.all(keys.filter(key => key.startsWith(cachePrefix) && key !== cacheName).map(key => caches.delete(key)))
    await self.clients.claim()
  })())
})
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url)
  const scope = self.registration.scope
  if (event.request.method !== 'GET') return
  const file = url.origin + url.pathname
  const cachedUrl = file === scope ? new URL('index.html',scope).href : file
  if (!urls.has(cachedUrl)) return
  event.respondWith((async () => {
    const cache = await caches.open(cacheName)
    // Prefer the current files on refresh, including during local design iterations.
    try {
      const response = await fetch(event.request)
      if (response.ok) await cache.put(cachedUrl,response.clone())
      return response
    } catch (error) {
      const offline = await cache.match(cachedUrl)
      if (offline) return offline
      throw error
    }
  })())
})
