try {
  if ('function' === typeof importScripts) {
    importScripts(
      'https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js'
    )

    // Global workbox
    if (workbox) {
      // console.log("Workbox is loaded");

      // Disable logging
      workbox.setConfig({ debug: false })

      //`generateSW` and `generateSWString` provide the option
      // to force update an exiting service worker.
      // Since we're using `injectManifest` to build SW,
      // manually overriding the skipWaiting();
      self.addEventListener('install', (event) => {
        self.skipWaiting() // Skip to activation step - taken care in serviceWorker.ts
      })

      // Manual injection point for manifest files.
      try {
        workbox.precaching.precacheAndRoute([{"revision":"0f2df2021163fffa82711ce5875a7367","url":"index.html"},{"revision":"33dbdd0177549353eeeb785d02c294af","url":"logo192.png"},{"revision":"917515db74ea8d1aee6a246cfbcc0b45","url":"logo512.png"}])
      } catch (e) {
        console.error(e)
      }

      // Font caching
      workbox.routing.registerRoute(
        new RegExp('https://fonts.(?:.googlepis|gstatic).com/(.*)'),
        new workbox.strategies.CacheFirst({
          cacheName: 'googleapis',
          plugins: [
            // new workbox.Plugin({
            //   maxAgeSeconds: 14 * 24 * 60 * 60, // 14 days
            // }),
          ],
        })
      )
    } else {
      console.error('Workbox could not be loaded. No offline support')
    }
  }
} catch (e) {
  console.error('Unable to install service worker. Possible network error.', e)
}
