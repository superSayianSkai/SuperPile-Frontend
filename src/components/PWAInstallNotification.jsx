import { useState, useEffect } from "react";
import supapile from "../assets/Images/supapile-icon2.svg";

const PWAInstallNotification = () => {
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [visitCount, setVisitCount] = useState(0);
  const [isPWAInstalled, setIsPWAInstalled] = useState(false);
  const [hasExtension, setHasExtension] = useState(false);

  useEffect(() => {
    // Only disable scroll when the popup is actually showing
    if (showInfoPopup && !isDismissed) {
      document.documentElement.style.overflow = "hidden";
      document.body.scroll = "no";
    }
    
    return () => {
      // Always restore scroll when component unmounts or popup hides
      document.documentElement.style.overflow = "auto";
      document.body.scroll = "yes";
    };
  }, [showInfoPopup, isDismissed]);

  useEffect(() => {
    console.log("App Info Popup: Component mounted");

    // Check if PWA is already installed
    const checkPWAInstalled = () => {
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
      const isInWebAppiOS = window.navigator.standalone === true;
      return isStandalone || isInWebAppiOS;
    };

    // Check if Chrome extension is installed
    const checkExtensionInstalled = () => {
      // Check if extension has injected any global variables or DOM elements
      return !!window.supapilechromeextension || 
             !!document.querySelector('[data-supapile-extension]') ||
             !!window.chrome?.runtime?.getManifest?.()?.name?.includes('SupaPile');
    };

    const pwaInstalled = checkPWAInstalled();
    const extensionInstalled = checkExtensionInstalled();
    
    setIsPWAInstalled(pwaInstalled);
    setHasExtension(extensionInstalled);

    console.log('Installation status:', { pwaInstalled, extensionInstalled });

    // Don't show popup if both PWA and extension are already installed
    if (pwaInstalled && extensionInstalled) {
      console.log("App Info Popup: Both PWA and extension installed, not showing");
      return;
    }

    // Check if already dismissed
    const dismissed = localStorage.getItem("app-info-dismissed");
    const dismissedTime = localStorage.getItem("app-info-dismissed-time");

    if (dismissed && dismissedTime) {
      const now = new Date().getTime();
      const dismissTime = parseInt(dismissedTime);
      // Show again after 7 days
      if (now - dismissTime < 7 * 24 * 60 * 60 * 1000) {
        console.log("App Info Popup: Previously dismissed, not showing");
        setIsDismissed(true);
        return;
      } else {
        // Clear old dismissal
        localStorage.removeItem("app-info-dismissed");
        localStorage.removeItem("app-info-dismissed-time");
      }
    }

    // Track visit count
    const currentVisitCount = parseInt(localStorage.getItem("app-visit-count") || "0");
    const newVisitCount = currentVisitCount + 1;
    localStorage.setItem("app-visit-count", newVisitCount.toString());
    setVisitCount(newVisitCount);

    // Only show after 3+ visits
    if (newVisitCount >= 3) {
      console.log(`App Info Popup: Visit count ${newVisitCount}, showing popup`);
      setShowInfoPopup(true);
    } else {
      console.log(`App Info Popup: Visit count ${newVisitCount}, not showing yet`);
    }

  }, []);

  const handleDismiss = () => {
    console.log("App Info Popup: User dismissed popup");
    const now = new Date().getTime();
    localStorage.setItem("app-info-dismissed", "true");
    localStorage.setItem("app-info-dismissed-time", now.toString());
    setShowInfoPopup(false);
    setIsDismissed(true);
  };

  const handleGetExtension = () => {
    // Open Chrome Web Store in new tab
    window.open("https://chrome.google.com/webstore/search/supapile", "_blank");
  };

  const handleInstallPWA = () => {
    // Show PWA installation instructions
    alert('To install SupaPile as an app:\n\n📱 On Mobile:\n1. Tap browser menu (⋮)\n2. Select "Add to Home Screen"\n3. Tap "Add"\n\n💻 On Desktop:\n1. Look for install icon in address bar\n2. Or use browser menu → "Install SupaPile"');
  };

  // Don't show if dismissed, visit count < 3, or both PWA and extension are installed
  if (!showInfoPopup || isDismissed || (isPWAInstalled && hasExtension)) {
    return null;
  }

  // Determine what to show based on what's already installed
  const getContent = () => {
    if (isPWAInstalled && !hasExtension) {
      return {
        title: "Complete Your SupaPile Setup! 🧩",
        description: "You have the app installed! Get our Chrome extension to save links instantly while browsing.",
        showPWAButton: false,
        showExtensionButton: true
      };
    } else if (!isPWAInstalled && hasExtension) {
      return {
        title: "Install SupaPile App! 📱",
        description: "You have our extension! Install the app for offline access and faster performance.",
        showPWAButton: true,
        showExtensionButton: false
      };
    } else {
      return {
        title: "Welcome to SupaPile! 🎉",
        description: "Organize your links like never before with our powerful features:",
        showPWAButton: true,
        showExtensionButton: true
      };
    }
  };

  const content = getContent();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] flex items-end sm:items-center justify-center">
      <div className="bg-white text-black rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300 ease-out">
        <div className="flex flex-col items-center gap-4 p-6 sm:p-8">
          {/* App Icon */}
          <img src={supapile} alt="SupaPile" className="w-16 h-16" />

          {/* Title and Description */}
          <div className="text-center w-full">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
              {content.title}
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              {content.description}
            </p>
            
            {/* Features List - only show if both are missing */}
            {!isPWAInstalled && !hasExtension && (
              <div className="text-left space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <span className="text-blue-500 text-lg">📱</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">Progressive Web App</h3>
                    <p className="text-xs text-gray-600">Install as a native app for offline access and faster loading</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <span className="text-green-500 text-lg">🔗</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">Smart Link Management</h3>
                    <p className="text-xs text-gray-600">Organize, categorize, and access your links from anywhere</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <span className="text-purple-500 text-lg">🧩</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">Chrome Extension</h3>
                    <p className="text-xs text-gray-600">Save links instantly while browsing with our browser extension</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <span className="text-orange-500 text-lg">☁️</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">Cloud Sync</h3>
                    <p className="text-xs text-gray-600">Access your links across all devices with automatic synchronization</p>
                  </div>
                </div>
              </div>
            )}

            {/* Status indicators */}
            <div className="flex justify-center gap-4 mb-4">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
                isPWAInstalled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
              }`}>
                <span>{isPWAInstalled ? '✅' : '⭕'}</span>
                PWA {isPWAInstalled ? 'Installed' : 'Not Installed'}
              </div>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
                hasExtension ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
              }`}>
                <span>{hasExtension ? '✅' : '⭕'}</span>
                Extension {hasExtension ? 'Installed' : 'Not Installed'}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 w-full mt-2">
            {content.showExtensionButton && (
              <button
                onClick={handleGetExtension}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                🧩 Get Chrome Extension
              </button>
            )}
            
            {content.showPWAButton && (
              <button
                onClick={handleInstallPWA}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                📱 Install as App
              </button>
            )}
            
            <button
              onClick={handleDismiss}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:-translate-y-0.5"
            >
              {isPWAInstalled || hasExtension ? 'Got it!' : 'Maybe Later'}
            </button>
          </div>
          
          {/* Visit counter for testing */}
          <p className="text-xs text-gray-400 mt-2">
            Visit #{visitCount} • All Devices
          </p>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallNotification;
