// Service Worker for offline support
const CACHE_NAME = 'notes-app-v2'
const URLS_TO_CACHE = [
  '/',
  '/manifest.json',
]

// Install event
self.addEventListener('install', (event) => {
  console.log('An-Nashriyyah Service Worker installing...')
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[v0] Cache opened')
      return cache.addAll(URLS_TO_CACHE)
    })
  )
  self.skipWaiting()
})

// Activate event
self.addEventListener('activate', (event) => {
  console.log('An-Nashriyyah Service Worker activating...')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('An-Nashriyyah Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch event - cache first for static assets
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return
  }

  const url = new URL(event.request.url)
  const isNextAsset = url.pathname.startsWith('/_next/')
  const isApi = url.pathname.startsWith('/api/')
  const accept = event.request.headers.get('accept') || ''
  const isNavigation = accept.includes('text/html')

  if (isNextAsset || isApi || isNavigation) {
    return
  }

  // Cache first strategy for static assets
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response
      }

      return fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200) {
            return response
          }

          const responseToCache = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })

          return response
        })
        .catch(() => {
          // Return offline page if available
          return caches.match('/')
        })
    })
  )
})

// Handle push notifications for local alerts
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {}
  const options = {
    body: data.body || 'New notification from An-Nashriyyah App',
    icon: '/icon-192x192.png',
    badge: '/icon-96x96.png',
    tag: 'notes-notification',
    requireInteraction: false,
  }



  event.waitUntil(
    self.registration.showNotification(data.title || 'An-Nashriyyah App', options)
  )
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Find existing window
      for (let client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus()
        }
      }
      // Open new window if none exists
      if (clients.openWindow) {
        return clients.openWindow('/')
      }
    })
  )
})
