const cachePrefix = 'arlodjie-static-' + new URL(self.registration.scope).pathname + '-'
const cacheName = cachePrefix + 'v7'
const files = [
  'index.html','styles.css','banner.css','image-file.js','photo-storage.js','shop-api.js','banner.js','prototype.js','pwa.js',
  'app.webmanifest','logo.svg','lockup.svg','assets/app-192.png','assets/app-512.png',
  'assets/dm-sans.woff2','assets/cormorant-garamond.woff2',
  'assets/alpinist.png','assets/f91w.jpg','assets/field.jpg','assets/gshock.png','assets/hero.jpg',
  'assets/leather.jpg','assets/murph-front.jpg','assets/murph.jpg','assets/presage.jpg','assets/prx.jpg',
  'assets/shunbun-dial.jpg','assets/shunbun.png','assets/srpe55.jpg','assets/steel.jpg'
]
const urls = new Set(files.map(file => new URL(file,self.registration.scope).href))
const publicApi = new Set(['api/products','api/banner'].map(path=>new URL(path,self.registration.scope).href))
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(cacheName)
    await cache.addAll([...urls].map(url => new Request(url,{cache:'reload'})))
    await Promise.allSettled([...publicApi].map(url=>cache.add(new Request(url,{
      credentials:'omit', signal:AbortSignal.timeout(4000),
    }))))
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
  const publicData = publicApi.has(url.href)
  if (!urls.has(cachedUrl) && !publicData) return
  event.respondWith((async () => {
    const cache = await caches.open(cacheName)
    // Prefer the current files on refresh, including during local design iterations.
    try {
      const response = await fetch(publicData ? new Request(event.request,{credentials:'omit'}) : event.request)
      if (response.ok) await cache.put(cachedUrl,response.clone())
      if(publicData && response.status >= 500) return await cache.match(cachedUrl) || response
      return response
    } catch (error) {
      const offline = await cache.match(cachedUrl)
      if (offline) return offline
      throw error
    }
  })())
})
