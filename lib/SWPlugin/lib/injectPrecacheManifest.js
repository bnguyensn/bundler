/**
 * Inject the precacheManifest array into the service worker file, which at this
 * point is a JavaScript string.
 *
 * @param {string} jsString - The service worker file but in the form of a
 * JavaScript string
 * @param {object[]} precacheManifest - An array of precache manifest objects.
 * Each object should have an 'url' key containing a built asset URL
 * @returns {string} - The provided JavaScript string, with the precache
 * manifest injected
 * */
function injectPrecacheManifest(jsString, precacheManifest) {
  return `self.__precacheManifest = ${JSON.stringify(
    precacheManifest,
  )};${jsString}`;
}

module.exports = injectPrecacheManifest;
