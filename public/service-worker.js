const CACHE_NAME = "supapile-shell-v3"; // Increment version
const API_CACHE = "supapile-api-v3"; // Increment version
const OFFLINE_PAGE = "/offline.html";
const CORE_ASSETS = [
  "/",
  "/index.html",
  "/offline.html",
  "/static/js/main.js", // adapt to your build output paths
  "/static/css/main.css",
  "/icons/supapile-icon (1).png",
];

// Install: cache app shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate: cleanup old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME && key !== API_CACHE)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Fetch: cache-first for assets, stale-while-revalidate for API, fallback to offline page
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Example: treat your API calls separately (adjust domain/path as needed)
  if (
    url.pathname.startsWith("/api/") ||
    url.hostname === "api.yoursupapile.com"
  ) {
    // Skip caching for auth/login endpoints
    // Remove line 51 entirely and fix the condition:
    if (
      url.pathname.startsWith("/auth") ||
      url.pathname.startsWith("/login") ||
      url.pathname.startsWith("/auth/user") ||
      url.pathname.startsWith("/auth/me")
    ) {
      event.respondWith(fetch(request));
      return;
    }

    // For all other API calls, keep networkFirst
    event.respondWith(networkFirst(request));
    return;
  }

  // For navigation (HTML) requests, try NETWORK FIRST for auth-related pages
  // For navigation (HTML) requests
  if (request.mode === "navigate") {
    const url = new URL(request.url);
    
    // Skip caching for OAuth redirects and auth-related pages
    if (
      url.searchParams.has('code') ||  // OAuth callback with code parameter
      url.searchParams.has('state') || // OAuth state parameter
      url.pathname === '/login' ||
      url.pathname === '/' ||  // Home page after login
      url.pathname.startsWith('/auth')
    ) {
      // For OAuth flows, try multiple strategies
      event.respondWith(
        fetch(request, {
          cache: 'no-cache',
          credentials: 'same-origin'
        })
        .catch(async (error) => {
          console.log('OAuth redirect fetch failed, trying cache:', error);
          // Try cache first, then offline page
          const cachedResponse = await caches.match('/');
          return cachedResponse || caches.match(OFFLINE_PAGE);
        })
      );
      return;
    }
    
    // Cache-first for other navigation
    event.respondWith(
      caches
        .match(request)
        .then(
          (res) => res || fetch(request).catch(() => caches.match(OFFLINE_PAGE))
        )
    );
    return;
  }

  // For other requests (assets): cache-first with fallback to network
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        // start background update
        event.waitUntil(
          fetch(request)
            .then((resp) => {
              if (resp && resp.ok) {
                caches
                  .open(CACHE_NAME)
                  .then((cache) => cache.put(request, resp.clone()))
                  .catch(() => {}); // Handle potential clone errors
              }
            })
            .catch(() => {})
        );
        return cached;
      }
      return fetch(request)
        .then((resp) => {
          // optional: cache fetched asset
          if (resp && resp.ok && request.url.startsWith(self.location.origin)) {
            // Clone the response before using it
            const responseClone = resp.clone();
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(request, responseClone))
              .catch(() => {}); // Handle potential cache errors
          }
          return resp;
        })
        .catch(() => caches.match(OFFLINE_PAGE));
    })
  );
});

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.ok) {
      const cache = await caches.open(API_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (err) {
    console.log(err);
    const cached = await caches.match(request);
    return cached || caches.match(OFFLINE_PAGE);
  }
}

// Add message listener for force refresh
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'FORCE_REFRESH') {
    // Clear all caches and force refresh
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
    }).then(() => {
      self.clients.matchAll().then(clients => {
        clients.forEach(client => client.navigate(client.url));
      });
    });
  }
  // Add logout handler
  if (event.data && event.data.type === 'LOGOUT') {
    // Clear all caches on logout
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
    });
  }
});
