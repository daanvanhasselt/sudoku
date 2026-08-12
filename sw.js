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
        workbox.precaching.precacheAndRoute([{"revision":"a86da47dbbf757a6756b3bf60774a53c","url":"index.html"},{"revision":"33dbdd0177549353eeeb785d02c294af","url":"logo192.png"},{"revision":"917515db74ea8d1aee6a246cfbcc0b45","url":"logo512.png"},{"revision":"3998155c809033f33929553e79007c9d","url":"static/js/117.005f7353.chunk.js"},{"revision":"5396aa4444a872598925f9d55c45b86e","url":"static/js/293.d32a9c03.chunk.js"},{"revision":"bf41efaa9635f52d58390bf1da8580c4","url":"static/js/617.a0b0a006.chunk.js"},{"revision":"a53b24f891ca75e3f82f5a481afc9627","url":"static/js/751.c80b25f5.chunk.js"},{"revision":"21e95614921926c681f64c3e709f0af9","url":"static/js/767.b0aeb52c.chunk.js"}])
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
