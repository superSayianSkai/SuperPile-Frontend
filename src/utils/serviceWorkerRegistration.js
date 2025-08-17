// src/serviceWorkerRegistration.js
export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = `${window.location.origin}/service-worker.js`;
      navigator.serviceWorker.register(swUrl).then(reg => {
        console.log('Service worker registered:', reg);
        
        // Check for updates every 30 seconds
        setInterval(() => {
          reg.update();
        }, 30000);
        
        // Handle updates
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available, prompt user to reload
              if (confirm('New version available! Reload to update?')) {
                window.location.reload();
              }
            }
          });
        });
        
      }).catch(err => {
        console.warn('Service worker registration failed:', err);
      });
    });
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(regs => {
      regs.forEach(r => r.unregister());
    });
  }
}