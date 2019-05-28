/**
 * To learn how service workers work, visit:
 * https://developers.google.com/web/fundamentals/primers/service-workers/
 * */

export default function register() {
  if ('serviceWorker' in navigator) {
    // This is how we obtain Workbox's ManifestEntry array, which is an array
    // of objects with keys 'url' and 'revision'. Reference below:
    // https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-build#.ManifestEntry
    const MANIFEST_ENTRIES = self.__precacheManifest;

    // ============================ //
    // 1. REGISTER A SERVICE WORKER
    // ============================ //
    // Registration simply means telling the browser where the service worker
    // JavaScript file is. Registration can be performed on every page load
    // without concern as the browser will handle different cases accordingly.

    window.addEventListener('load', () => {
      navigator.serviceWorker
        // By registering the service worker at the root domain, its scope will be
        // the entire domain.
        .register('/serviceWorker.js')
        .then(
          registration => {
            // On successful registration, the service worker is executed in a
            // special worker context, separate from the main JavaScript execution
            // thread. This context does not have access to the DOM.
            // TODO: notify user of successful service worker registration
          },
          err => {
            // TODO: handle errors
          },
        );
    });

    // ============================= //
    // 2. INSTALL THE SERVICE WORKER
    // ============================= //
    // If the registration is successful, the browser will install the service
    // worker on subsequent page loads.
    const latestCacheName = '';

    self.addEventListener('install', e => {
      e.waitUntil(
        caches.open('').then(
          cache => {
            return cache.addAll([]);
          },
          err => {
            // TODO: handle errors
          },
        ),
      );
    });

    self.addEventListener('activate', e => {
      e.waitUntil(
        // Delete old caches
        caches.keys().then(allCacheNames => {
          return Promise.all(
            allCacheNames.map(cacheName => {
              if (cacheName !== latestCacheName) {
                return caches.delete(cacheName);
              }
            }),
          );
        }),
      );
    });
  }
}
