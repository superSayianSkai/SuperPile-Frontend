// src/service-worker.js
import { precacheAndRoute } from "workbox-precaching";
import { registerRoute, NavigationRoute } from "workbox-routing";
import {
  NetworkFirst,
  CacheFirst,
  StaleWhileRevalidate,
} from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";

// =======================
// 1️⃣ Precache React build assets
// =======================
precacheAndRoute(self.__WB_MANIFEST, { url: "/offline.html", revision: 1 }); // Workbox injects all your build assets here


// =======================
// 2️⃣ NetworkFirst for API calls
// =======================
registerRoute(
  ({ url }) =>
    url.pathname.startsWith("/api/") &&
    !url.pathname.startsWith("/auth") &&
    !url.pathname.startsWith("/login"),
  new NetworkFirst({
    cacheName: "supapile-api-v1",
    networkTimeoutSeconds: 3, // fallback to cache if network is slow
  })
);

// =======================
// 3️⃣ NetworkFirst for navigation (HTML pages)
// =======================
const navigationHandler = new NetworkFirst({
  cacheName: "supapile-shell-v1",
  networkTimeoutSeconds: 3,
});

const navigationRoute = new NavigationRoute(navigationHandler, {
  denylist: [
    /\/auth/, // ignore login/auth routes
    /\/login/,
    /\?code=/, // OAuth redirects
    /\?state=/,
  ],
});

registerRoute(navigationRoute);

// =======================
// 4️⃣ CacheFirst for images
// =======================
registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "supapile-images-v1",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50, // max 50 images cached
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
      }),
    ],
  })
);

// =======================
// 5️⃣ StaleWhileRevalidate for CSS/JS
// =======================
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
