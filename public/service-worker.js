// src/service-worker.js
import { precacheAndRoute } from "workbox-precaching";
import { registerRoute, NavigationRoute } from "workbox-routing";
import {
  NetworkFirst,
  CacheFirst,
  StaleWhileRevalidate,
} from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";

// Precache specific assets and build manifest
precacheAndRoute([
  // Precache specific images
  { url: '/src/assets/Images/supapileCat2.png', revision: null },
  { url: '/src/assets/Images/supapile.webp', revision: null },
  { url: '/src/assets/Images/pokiemon.gif', revision: null },
  // Precache offline page
  { url: '/offline.html', revision: '1' },
  // Precache build assets
  ...self.__WB_MANIFEST
]);

// NetworkFirst for API calls
registerRoute(
  ({ url }) =>
    url.pathname.startsWith("/api/") &&
    !url.pathname.startsWith("/auth") &&
    !url.pathname.startsWith("/login"),
  new NetworkFirst({
    cacheName: "supapile-api-v1",
    networkTimeoutSeconds: 3,
  })
);

// Navigation handling
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

// Enhanced image caching strategy
registerRoute(
  ({ request, url }) => {
    // Check if it's an image request
    if (request.destination === "image") {
      // Priority cache for specific images
      const priorityImages = [
        '/src/assets/Images/supapileCat2.png',
        '/src/assets/Images/supapile.webp',
        '/src/assets/Images/pokiemon.gif'
      ];
      return priorityImages.some(img => url.pathname.includes(img));
    }
    return false;
  },
  new CacheFirst({
    cacheName: "supapile-priority-images-v1",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

// General image caching
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

// Cache static assets
registerRoute(
  ({ request }) =>
    request.destination === "script" || request.destination === "style",
  new StaleWhileRevalidate({
    cacheName: "supapile-static-v1",
  })
);

self.addEventListener("install", () => {
  self.skipWaiting();
});
