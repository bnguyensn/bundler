// This is how we obtain Workbox's ManifestEntry array, which is an array
// of objects with keys 'url' and 'revision' for the static assets generated
// by webpack. Reference:
// https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-build#.ManifestEntry
const MANIFEST_ENTRIES = self.__WB_MANIFEST;

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
  console.log('Service worker: installing...');

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
        console.log(
          `Error occurred during the service worker's install step: ${err}`,
        );
      },
    ),
  );
});

// ============ //
// FETCH EVENTS
// ============ //
// A fetch event fires when an in-scope resource is requested. An installed
// service worker will hijack the request and respond with custom data.
// Fetch events are how service workers serve offline content.

self.addEventListener('fetch', e => {
  console.log('Service worker: fetch event fired!');

  e.respondWith(
    caches
      .match(e.request)
      .then(response => {
        // If a response is found in the cache then we return it.
        if (response) return response;

        // If a resource is not found in the cache, then response will be
        // undefined. When this happens, we fetch the resource from the
        // Internet and add it to the cache.
        return fetch(e.request).then(fetchedResponse => {
          if (
            !fetchedResponse ||
            fetchedResponse.status !== 200 ||
            fetchedResponse.type !== 'basic'
          ) {
            return fetchedResponse;
          }

          // Response is a stream and can only be consumed once. Since we want
          // both the browser and the cache to consume the response, we need to
          // clone it for one of them.
          const fetchedResponseToCache = fetchedResponse.clone();

          caches.open(latestCacheName).then(cache => {
            cache.put(e.request, fetchedResponseToCache);
          });

          return fetchedResponse;
        });
      })
      .catch(err => {
        // This will happen when there's nothing in the cache and the Internet
        // is down.
        console.log(
          `Error occurred during the service worker's fetch event: ${err}`,
        );
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
  console.log('Service worker event: activate');

  e.waitUntil(
    // Delete old caches
    caches.keys().then(allCacheNames => {
      return Promise.all(
        allCacheNames.map(cacheName => {
          if (cacheName !== latestCacheName) {
            return caches.delete(cacheName);
          }
        }),
      ).catch(err => {
        // TODO: handle errors here
        console.log(
          `Error occurred during the service worker's activation step: ${err}`,
        );
      });
    }),
  );
});
