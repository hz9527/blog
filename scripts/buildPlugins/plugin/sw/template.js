const Matches = [/\.css$/, /\.js$/, /\.svg$/, /\.(png|jpe?g)$/]
const KEY = 'v1'
const ROUTER = true
const FILES = []
const ASSETS = ''

self.addEventListener('install', e => {
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(list => {
      return Promise.all(list.map(async (k) => {
        if (k === KEY) {
          const cache = await caches.open(k)
          const keys = await cache.keys()
          return Promise.all(keys.map(req => {
            if (ASSETS && !req.url.includes(ASSETS)) {
              return null
            }
            const ind = FILES.findIndex(url => req.url.includes(url.slice(1)))
            return ~ind ? null : cache.delete(req)
          }))
        }
        return caches.delete(k)
      }))
    })
  )
})

function cacheFetcher (request, saver = res => res) {
  return fetch(request).then(rep => {
    return caches.open(KEY).then(cache => {
      cache.put(saver(request), rep.clone())
      return rep
    })
  })
}

function getRequest (request) {
  const url = new URL(request.url)
  let path = url.pathname
  if (ROUTER && !/\.html$/.test(url.pathname) && path.split('/').length > 2) {
    path = path.slice(0, path.lastIndexOf('/'))
  }
  const u = url.origin + path
  return request.url === u ? request : new Request(u)
}

self.addEventListener('fetch', event => {
  if (event.request.destination === 'document') {
    event.respondWith(
      cacheFetcher(event.request, getRequest).catch(() => {
        return caches.match(getRequest(event.request))
      })
    )
  }
  if (!Matches.some(reg => reg.test(event.request.url))) {
    return
  }
  event.respondWith(
    caches.match(event.request).then(resp => {
      return resp || cacheFetcher(event.request)
    })
  )
})
