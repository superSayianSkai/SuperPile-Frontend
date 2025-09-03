// ------------------------------------------------------------
// Import Workbox from CDN
// ------------------------------------------------------------
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

const { precacheAndRoute, createHandlerBoundToURL } = workbox.precaching;
const { registerRoute, NavigationRoute } = workbox.routing;
const { NetworkFirst, CacheFirst, StaleWhileRevalidate } = workbox.strategies;
const { ExpirationPlugin } = workbox.expiration;
const { offlineFallback } = workbox.recipes;

// ------------------------------------------------------------
// 
// ------------------------------------------------------------
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Take control of all clients immediately
      await self.clients.claim();

      // Delete old caches (bump version when you deploy)
      const expectedCaches = [
        "supapile-shell-v2",   // 🔥 bump this on new deploys
        "supapile-auth-v1",
        "supapile-api-v1",
        "supapile-static-v1",
        "supapile-images-v1",
      ];

      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => {
          if (!expectedCaches.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })()
  );
});

// ------------------------------------------------------------
// Precache app shell + offline page
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
    cacheName: "supapile-api-v2",
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
  cacheName: "supapile-shell-v2", // bump this when you redeploy
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
// Offline fallback (only if no shell cached)
// ------------------------------------------------------------
offlineFallback({
  pageFallback: '/offline.html',
});