// src/utils/serviceWorkerRegistration.js
export function register() {
  if ("serviceWorker" in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log("Service Worker registered successfully:", registration.scope);
          
          // Handle updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available, notify user if needed
                console.log('New content is available; please refresh.');
              }
            });
          });
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    });
  }
}

export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister().then(() => {
          console.log('Service Worker unregistered successfully');
        });
      });
    });
  }
}
