const CACHE_NAME = 'la-esquinita-v1'
const STATIC_CACHE = [
  '/',
  '/storefront',
  '/fonts/skeleton-blood.woff2',
  '/fonts/skeleton-blood.woff',
  '/logo/locustprojects1.png',
  '/front.jpg'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_CACHE)
    })
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    })
  )
  self.clients.claim()
})

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return

  // Skip chrome extensions
  if (event.request.url.startsWith('chrome-extension://')) return

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone response before caching
        const responseClone = response.clone()

        // Cache successful responses
        if (response.status === 200) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone)
          })
        }

        return response
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse
          }

          // Return offline page for HTML requests
          if (event.request.headers.get('accept').includes('text/html')) {
            return new Response(
              `<html>
                <body style="font-family: system-ui; padding: 2rem; text-align: center;">
                  <h1>🦟 La Esquinita</h1>
                  <p>You're offline. Please check your connection.</p>
                </body>
              </html>`,
              { headers: { 'Content-Type': 'text/html' } }
            )
          }
        })
      })
  )
})
