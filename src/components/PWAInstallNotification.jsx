import { useState, useEffect } from "react";
import supapile from "../assets/Images/supapile-icon2.svg";
const PWAInstallNotification = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    useEffect(() => {
      // Only disable scroll when the notification is actually showing
      if (showInstallPrompt && !isDismissed) {
        document.documentElement.style.overflow = "hidden";
        document.body.scroll = "no";
      }
      
      return () => {
        // Always restore scroll when component unmounts or notification hides
        document.documentElement.style.overflow = "auto";
        document.body.scroll = "yes";
      };
    }, [showInstallPrompt, isDismissed]); // Add dependencies to re-run when these change

    // Debug logging

    console.log("PWA Install Notification: Component mounted");

    // Detect device type
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    const isChrome = /Chrome/.test(navigator.userAgent);

    setIsIOS(iOS);

    console.log("Device detection:", { iOS, isAndroid, isChrome });
    setDebugInfo(`iOS: ${iOS}, Android: ${isAndroid}, Chrome: ${isChrome}`);

    // Check if already dismissed
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    const dismissedTime = localStorage.getItem("pwa-install-dismissed-time");

    if (dismissed && dismissedTime) {
      const now = new Date().getTime();
      const dismissTime = parseInt(dismissedTime);
      // Show again after 1 day for testing (change back to 7 days later)
      if (now - dismissTime < 1 * 24 * 60 * 60 * 1000) {
        console.log("PWA Install: Previously dismissed, not showing");
        setIsDismissed(true);
        return;
      } else {
        // Clear old dismissal
        localStorage.removeItem("pwa-install-dismissed");
        localStorage.removeItem("pwa-install-dismissed-time");
      }
    }

    // Check if app is already installed
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;
    const isInWebAppiOS = window.navigator.standalone === true;
    const isInstalled = isStandalone || isInWebAppiOS;

    console.log("Installation status:", {
      isStandalone,
      isInWebAppiOS,
      isInstalled,
    });

    if (isInstalled) {
      console.log("PWA Install: App already installed");
      return;
    }

    // For iOS, show manual install instructions immediately
    if (iOS) {
      console.log("PWA Install: iOS detected, showing manual instructions");
      setShowInstallPrompt(true);
      return;
    }

    // For Android/Chrome, listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      console.log("PWA Install: beforeinstallprompt event fired", e);
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Save the event so it can be triggered later
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    // Add event listener
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // For testing: show prompt after 3 seconds if no beforeinstallprompt event
    const testTimer = setTimeout(() => {
      if (!deferredPrompt && !iOS && !isInstalled) {
        console.log(
          "PWA Install: No beforeinstallprompt event after 3s, showing anyway for testing"
        );
        setShowInstallPrompt(true);
      }
    }, 3000);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      clearTimeout(testTimer);
    };
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    if (isIOS) {
      // For iOS, we can't trigger install programmatically
      console.log("PWA Install: iOS - showing manual instructions");
      return;
    }

    if (!deferredPrompt) {
      console.log("PWA Install: No deferred prompt available");
      return;
    }

    try {
      // Show the install prompt
      console.log("PWA Install: Showing install prompt");
      deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;

      console.log("PWA Install: User choice:", outcome);

      // Clear the deferredPrompt
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    } catch (error) {
      console.error("PWA Install: Error during installation:", error);
    }
  };

  const handleDismiss = () => {
    console.log("PWA Install: User dismissed prompt");
    const now = new Date().getTime();
    localStorage.setItem("pwa-install-dismissed", "true");
    localStorage.setItem("pwa-install-dismissed-time", now.toString());
    setShowInstallPrompt(false);
    setIsDismissed(true);
  };

  // Normal condition
  if (!showInstallPrompt || isDismissed) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] flex items-end sm:items-center justify-center ">
      <div className="bg-white text-black rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300 ease-out">
        <div className="flex flex-col items-center gap-4 p-6 sm:p-8">
          {/* App Icon */}
          <img src={supapile} />

          {/* Title and Description */}
          <div className="text-center w-full">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
              Install SupaPile App
            </h2>
            <p className="text-sm text-gray-600">
              Add SupaPile to your home screen for quick access and a better
              experience!
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
            <button
              onClick={handleInstallClick}
              className="flex-1 bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Install
            </button>
            <button
              onClick={handleDismiss}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:-translate-y-0.5"
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
