const CACHE_NAME = "fside-pro-v1"
const urlsToCache = [
  "/",
  "/ide",
  "/admin",
  "/api-dashboard",
  "/static/js/bundle.js",
  "/static/css/main.css",
  "/manifest.json",
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    }),
  )
})

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      if (response) {
        return response
      }
      return fetch(event.request)
    }),
  )
})

// Handle background sync for offline code saving
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    event.waitUntil(doBackgroundSync())
  }
})

function doBackgroundSync() {
  // Sync offline changes when connection is restored
  return new Promise((resolve) => {
    // Implementation for syncing offline changes
    resolve()
  })
}
