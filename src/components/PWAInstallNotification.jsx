import { useState, useEffect } from "react";

const PWAInstallNotification = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    // Debug logging
    console.log('PWA Install Notification: Component mounted');
    
    // Detect device type
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    const isChrome = /Chrome/.test(navigator.userAgent);
    
    setIsIOS(iOS);
    
    console.log('Device detection:', { iOS, isAndroid, isChrome });
    setDebugInfo(`iOS: ${iOS}, Android: ${isAndroid}, Chrome: ${isChrome}`);

    // Check if already dismissed
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    const dismissedTime = localStorage.getItem("pwa-install-dismissed-time");
    
    if (dismissed && dismissedTime) {
      const now = new Date().getTime();
      const dismissTime = parseInt(dismissedTime);
      // Show again after 1 day for testing (change back to 7 days later)
      if (now - dismissTime < 1 * 24 * 60 * 60 * 1000) {
        console.log('PWA Install: Previously dismissed, not showing');
        setIsDismissed(true);
        return;
      } else {
        // Clear old dismissal
        localStorage.removeItem("pwa-install-dismissed");
        localStorage.removeItem("pwa-install-dismissed-time");
      }
    }

    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = window.navigator.standalone === true;
    const isInstalled = isStandalone || isInWebAppiOS;
    
    console.log('Installation status:', { isStandalone, isInWebAppiOS, isInstalled });

    if (isInstalled) {
      console.log('PWA Install: App already installed');
      return;
    }

    // For iOS, show manual install instructions immediately
    if (iOS) {
      console.log('PWA Install: iOS detected, showing manual instructions');
      setShowInstallPrompt(true);
      return;
    }

    // For Android/Chrome, listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      console.log('PWA Install: beforeinstallprompt event fired', e);
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Save the event so it can be triggered later
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    // Add event listener
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // For testing: show prompt after 3 seconds if no beforeinstallprompt event
    const testTimer = setTimeout(() => {
      if (!deferredPrompt && !iOS && !isInstalled) {
        console.log('PWA Install: No beforeinstallprompt event after 3s, showing anyway for testing');
        setShowInstallPrompt(true);
      }
    }, 3000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(testTimer);
    };
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    if (isIOS) {
      // For iOS, we can't trigger install programmatically
      console.log('PWA Install: iOS - showing manual instructions');
      return;
    }

    if (!deferredPrompt) {
      console.log('PWA Install: No deferred prompt available');
      return;
    }

    try {
      // Show the install prompt
      console.log('PWA Install: Showing install prompt');
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log('PWA Install: User choice:', outcome);
      
      // Clear the deferredPrompt
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    } catch (error) {
      console.error('PWA Install: Error during installation:', error);
    }
  };

  const handleDismiss = () => {
    console.log('PWA Install: User dismissed prompt');
    const now = new Date().getTime();
    localStorage.setItem("pwa-install-dismissed", "true");
    localStorage.setItem("pwa-install-dismissed-time", now.toString());
    setShowInstallPrompt(false);
    setIsDismissed(true);
  };

  // Debug: always show for testing (remove this condition later)
  // if (!showInstallPrompt || isDismissed) {
  //   return null;
  // }

  // Normal condition (use this for production)
  if (!showInstallPrompt || isDismissed) {
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
            {isIOS ? (
              <div className="text-sm text-gray-600 mb-4">
                <p className="mb-2">To install this app on your iPhone/iPad:</p>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span>1. Tap the</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92S19.61 16.08 18 16.08z"/>
                  </svg>
                  <span>Share button</span>
                </div>
                <p>2. Then select "Add to Home Screen"</p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Add SupaPile to your home screen for quick access and a better experience!
                </p>
                {/* Debug info - remove in production */}
                <p className="text-xs text-gray-400 mb-2">
                  Debug: {debugInfo}
                </p>
                <p className="text-xs text-gray-400 mb-2">
                  Prompt available: {deferredPrompt ? 'Yes' : 'No'}
                </p>
              </div>
            )}
          </div>
          
          {/* Buttons */}
          <div className="flex gap-3 w-full">
            {!isIOS && (
              <button
                onClick={handleInstallClick}
                className="flex-1 bg-gradient-to-r from-pink-500 to-orange-500 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                disabled={!deferredPrompt && !isIOS}
              >
                {deferredPrompt ? 'Install App' : 'Install (Testing)'}
              </button>
            )}
            <button
              onClick={handleDismiss}
              className={`${isIOS ? 'w-full' : 'flex-1'} bg-gray-100 text-gray-700 px-4 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all`}
            >
              {isIOS ? 'Got it' : 'Not Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallNotification;