// This is the service worker file

const CACHE_NAME = 'my-app-cache'
const urlsToCache = ['/', '/index.html', 'offline.html']
const staticAssets = ['/', '/index.html', '/static/css/main.css', '/static/js/main.js']

const self = this
/*  Explenation
    retain a reference to the current context of this when 
    the value of this might change later on.
    
 */

// Instal Service worker 

self.addEventListener('install', event => {
   event.waitUntil(
      caches.open(CACHE_NAME).then(cache => {
         console.log('opened cache')
         return cache.addAll(urlsToCache)
         // devTools -> app -> clear site data
         //  return cache.addAll(staticAssets)
      })
   )
})

/* Listen for requests 
    Match all the request
    Than fetch the request
    Fetch failed ? catch and return the offline html
*/

self.addEventListener('fetch', event => {
   event.respondWith(
      caches.match(event.request).then(() => {
         return fetch(event.request).catch(() => caches.match('offline.html'))
      })
   )

   // GPT code
   //    const request = event.request
   //    event.respondWith(
   //       caches.match(request).then(response => {
   //          if (response) {
   //             return response
   //          }
   //          return fetch(request)
   //       })
   //    )
})

// Active the Service worker
self.addEventListener('activate', event => {
   const cacheWhiteList = []
   cacheWhiteList.push(CACHE_NAME)

   event.waitUntil(
      caches.keys().then(cacheNames =>
         Promise.all(
            cacheNames.map(cacheName => {
               if (!cacheWhiteList.includes(cacheName)) {
                  return caches.delete(cacheName)
               }
            })
         )
      )
   )
})
