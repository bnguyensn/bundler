/**
 * To learn how service workers work, visit:
 * https://developers.google.com/web/fundamentals/primers/service-workers/
 * */

export default function register() {
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
  }
}
