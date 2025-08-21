import { useState, useEffect } from "react";

const PWAInstallNotification = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if already dismissed
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    const dismissedTime = localStorage.getItem("pwa-install-dismissed-time");
    
    if (dismissed && dismissedTime) {
      const now = new Date().getTime();
      const dismissTime = parseInt(dismissedTime);
      // Show again after 7 days
      if (now - dismissTime < 7 * 24 * 60 * 60 * 1000) {
        setIsDismissed(true);
        return;
      }
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Save the event so it can be triggered later
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = window.navigator.standalone === true;
    const isInstalled = isStandalone || isInWebAppiOS;

    if (!isInstalled) {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    const now = new Date().getTime();
    localStorage.setItem("pwa-install-dismissed", "true");
    localStorage.setItem("pwa-install-dismissed-time", now.toString());
    setShowInstallPrompt(false);
    setIsDismissed(true);
  };

  // Don't show if dismissed or no prompt available
  if (!showInstallPrompt || isDismissed || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black backdrop-blur bg-opacity-50 z-[1000]">
      <div className="absolute bottom-0 sm:bottom-auto sm:top-1/2 left-1/2 -translate-x-1/2 sm:-translate-y-1/2 bg-white text-black rounded-tl-2xl rounded-tr-2xl sm:rounded-2xl overflow-hidden shadow-lg z-50 w-full max-w-md mx-4 sm:mx-0">
        <div className="flex flex-col items-center gap-4 p-6">
          {/* App Icon */}
          <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-orange-500 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" clipRule="evenodd" />
            </svg>
          </div>
          
          {/* Title and Description */}
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Install SupaPile App
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Add SupaPile to your home screen for quick access and a better experience!
            </p>
          </div>
          
          {/* Buttons */}
          <div className="flex gap-3 w-full">
            <button
              onClick={handleInstallClick}
              className="flex-1 bg-gradient-to-r from-pink-500 to-orange-500 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
            >
              Install App
            </button>
            <button
              onClick={handleDismiss}
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
            >
              Not Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallNotification;