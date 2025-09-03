// Use workbox from CDN
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

const { precacheAndRoute, createHandlerBoundToURL } = workbox.precaching;
const { registerRoute, NavigationRoute } = workbox.routing;
const { NetworkFirst, CacheFirst, StaleWhileRevalidate } = workbox.strategies;
const { ExpirationPlugin } = workbox.expiration;
const { offlineFallback } = workbox.recipes;

// ------------------------------------------------------------
// Precache specific assets
// ------------------------------------------------------------
precacheAndRoute([
  { url: '/icons/supapile-128.png', revision: null },
  { url: '/icons/supapile-192.png', revision: null },
  { url: '/icons/supapile-512.png', revision: null },
  { url: '/offline.html', revision: null },
  ...self.__WB_MANIFEST
]);

// ------------------------------------------------------------
// Auth-related API calls (short cache)
// ------------------------------------------------------------
registerRoute(
  ({ url }) => url.pathname.includes('/api/v1/auth/'),
  new NetworkFirst({
    cacheName: "supapile-auth-v1",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      }),
    ],
  })
);

// ------------------------------------------------------------
// API calls (persistent cache for offline browsing)
// ------------------------------------------------------------
registerRoute(
  ({ url }) =>
    url.pathname.startsWith("/api/") &&
    !url.pathname.includes('/auth/') &&
    !url.pathname.includes('/login'),
  new NetworkFirst({
    cacheName: "supapile-api-v1",
    networkTimeoutSeconds: 3,
    plugins: [
      {
        handlerDidError: async ({ request }) => {
          const cache = await caches.open("supapile-api-v1");
          const cachedResponse = await cache.match(request);

          if (cachedResponse) {
            return cachedResponse;
          }

          return new Response(
            JSON.stringify({
              error: "offline",
              message: "You are currently offline. Using cached data.",
              data: null
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        }
      }
    ]
  })
);

// ------------------------------------------------------------
// Navigation handling → App shell (cached when offline)
// ------------------------------------------------------------
const navigationHandler = new NetworkFirst({
  cacheName: "supapile-shell-v1",
  networkTimeoutSeconds: 3,
});

const navigationRoute = new NavigationRoute(navigationHandler, {
  denylist: [
    /\/auth/,
    /\/login/,
    /\?code=/,
    /\?state=/,
    /\/onboarding/,
  ],
});

registerRoute(navigationRoute);

// ------------------------------------------------------------
// Static assets (JS, CSS)
// ------------------------------------------------------------
registerRoute(
  ({ request }) =>
    request.destination === "script" ||
    request.destination === "style",
  new StaleWhileRevalidate({
    cacheName: "supapile-static-v1",
  })
);

// ------------------------------------------------------------
// Images
// ------------------------------------------------------------
registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "supapile-images-v1",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
      }),
    ],
  })
);

// ------------------------------------------------------------
// Service worker updates + cache cleanup
// ------------------------------------------------------------
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== 'supapile-auth-v1' && cacheName.startsWith('supapile-')) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});

// ------------------------------------------------------------
// Offline fallback (only if no shell cached)
// ------------------------------------------------------------
offlineFallback({
  pageFallback: '/offline.html',
});