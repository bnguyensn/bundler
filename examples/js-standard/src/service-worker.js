/**
 * To learn how service workers work, visit:
 * https://developers.google.com/web/fundamentals/primers/service-workers/
 *
 * A service worker file should be tailored to each application. This is because
 * different type of assets should be cached at different times. To find out
 * when to cache what, vist:
 * https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/
 *
 * Service worker gotchas:
 * https://developers.google.com/web/fundamentals/primers/service-workers/#rough_edges_and_gotchas
 *
 * Issues: Workbox's InjectManifest does not transpile. An issue that stems from
 * this is that export / import is not valid:
 * https://github.com/GoogleChrome/workbox/issues/1513
 * Workbox v5 will fix this:
 * https://github.com/GoogleChrome/workbox/issues/1854
 *
 * This template service worker file caches all assets during installation.
 * */

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
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
        .register('/service-worker.js')
        .then(
          registration => {
            // On successful registration, the service worker is executed in a
            // special worker context, separate from the main JavaScript execution
            // thread. This context does not have access to the DOM.
            // TODO: notify user of successful service worker registration

            return registration;
          },
          err => {
            // TODO: handle errors
          },
        );
    });
  }
}

function installServiceWorker() {
  // This is how we obtain Workbox's ManifestEntry array, which is an array
  // of objects with keys 'url' and 'revision' for the static assets generated
  // by webpack. Reference:
  // https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-build#.ManifestEntry
  const MANIFEST_ENTRIES = self.__precacheManifest;

  // ============================= //
  // 2. INSTALL THE SERVICE WORKER
  // ============================= //
  // If the registration is successful, the browser will install the service
  // worker.

  // Should the service worker need to be updated, the cache version number
  // also needs to be updated. This is so that the previous, now outdated,
  // service worker won't be disturbed.
  // An updated service worker will only be run if there are no longer any
  // pages with the outdated service worker still open.
  const latestCacheName = 'v1';

  // The install event fires upon successful installation. We populate our
  // caches here.
  self.addEventListener('install', e => {
    e.waitUntil(
      caches.open(latestCacheName).then(
        cache => {
          // Cache.addAll() takes an array of URLs, retrieves them, and adds
          // the resulting responses to the given cache.
          // NOTE: a long list of files to cache in this install step will
          // increase the risk of the installation not being finished.
          // Therefore only files that are necessary for the page to function
          // should be cached in the install step.
          return cache.addAll(MANIFEST_ENTRIES.map(entry => entry.url));
        },
        err => {
          // TODO: handle errors
        },
      ),
    );
  });

  // ============ //
  // FETCH EVENTS
  // ============ //
  // A fetch event fires when an in-scope resource is requested. An installed
  // service worker will hijack the request and respond with custom data.

  self.addEventListener('fetch', e => {
    e.respondWith(
      caches
        .match(e.request)
        .then(
          res =>
            // If a resource is not found in the cache, then res will be
            // undefined. When this happens, we fetch the resource from the
            // Internet and add it to the cache.
            res ||
            fetch(e.request).then(r => {
              caches.open(latestCacheName).then(cache => {
                // We put a clone of the request into the cache because
                // request and response streams can only be consumed once. The
                // original request will be returned to the browser and the
                // cloned request will be put into the cache.
                cache.put(e.request, r.clone());
              });
            }),
        )
        .catch(() => {
          // TODO: give a 404 page? This happens when there is nothing in the cache and the Internet is down
        }),
    );
  });

  // =================================== //
  // 3. ACTIVATION OF THE SERVICE WORKER
  // =================================== //
  // The activate event fires on a page refresh after the service worker
  // succeeded in installing.
  // The activate event is useful to do stuff that would have broken the
  // previous service worker while it is still running (e.g. deleting old
  // caches).

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

// export { registerServiceWorker, installServiceWorker };
