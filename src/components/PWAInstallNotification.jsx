import { useState, useEffect } from "react";
import supapile from "../assets/Images/supapile-icon2.svg";

const PWAInstallNotification = () => {
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isPWAInstalled, setIsPWAInstalled] = useState(false);
  const [hasExtension, setHasExtension] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [showDismissMessage, setShowDismissMessage] = useState(false);

  // Features data for carousel
  const features = [
    {
      icon: "📱",
      color: "text-blue-500",
      title: "Progressive Web App",
      description:
        "Get the full app experience with offline access and easy link sharing between apps",
    },
    {
      icon: "🔗",
      color: "text-green-500",
      title: "Smart Link Management",
      description:
        "Organize, share, categorize, and access your links from anywhere",
    },
    {
      icon: "🧩",
      color: "text-purple-500",
      title: "Chrome Extension",
      description:
        "Save links instantly while browsing without visiting the main site",
    },
    {
      icon: "☁️",
      color: "text-orange-500",
      title: "Cloud Sync",
      description:
        "Access your links across all devices with automatic synchronization",
    },
  ];

  useEffect(() => {
    if (showInfoPopup && !isDismissed) {
      document.documentElement.style.overflow = "hidden";
      document.body.scroll = "no";
    }

    return () => {
      document.documentElement.style.overflow = "auto";
      document.body.scroll = "yes";
    };
  }, [showInfoPopup, isDismissed]);

  useEffect(() => {
    console.log("App Info Popup: Component mounted");

    const checkPWAInstalled = () => {
      const isStandalone = window.matchMedia(
        "(display-mode: standalone)"
      ).matches;
      const isInWebAppiOS = window.navigator.standalone === true;
      return isStandalone || isInWebAppiOS;
    };

    const checkExtensionInstalled = () => {
      return (
        !!window.supapilechromeextension ||
        !!document.querySelector("[data-supapile-extension]") ||
        !!window.chrome?.runtime?.getManifest?.()?.name?.includes("SupaPile")
      );
    };

    const pwaInstalled = checkPWAInstalled();
    const extensionInstalled = checkExtensionInstalled();

    setIsPWAInstalled(pwaInstalled);
    setHasExtension(extensionInstalled);

    if (pwaInstalled && extensionInstalled) {
      console.log("App Info Popup: Both installed, not showing");
      return;
    }

    const dismissed = localStorage.getItem("app-info-dismissed");
    const dismissedTime = localStorage.getItem("app-info-dismissed-time");

    if (dismissed) {
      const now = new Date().getTime();
      const dismissTime = parseInt(dismissedTime);
      if (now - dismissTime < 7 * 24 * 60 * 60 * 1000) {
        console.log("App Info Popup: Previously dismissed, not showing");
        setIsDismissed(true);
        return;
      } else {
        localStorage.removeItem("app-info-dismissed");
      }
    }

    const currentVisitCount = parseInt(
      localStorage.getItem("app-visit-count") || "0"
    );
    const newVisitCount = currentVisitCount + 1;
    localStorage.setItem("app-visit-count", newVisitCount.toString());

    if (newVisitCount >= 3) {
      setShowInfoPopup(true);
    }
  }, []);

  const handleDismiss = () => {
    console.log("App Info Popup: User dismissed popup");
    const now = new Date().getTime();
    localStorage.setItem("app-info-dismissed", "true");
    localStorage.setItem("app-info-dismissed-time", now.toString());
    setShowInfoPopup(false);
    setIsDismissed(true);

    // Show toast message for 5s
    setShowDismissMessage(true);
    setTimeout(() => setShowDismissMessage(false), 5000);
  };

  const handleGetExtension = () => {
    window.open("https://chrome.google.com/webstore/search/supapile", "_blank");
  };

  const handleInstallPWA = () => {
    alert(
      'To install SupaPile as an app:\n\n📱 On Mobile:\n1. Tap browser menu (⋮)\n2. Select "Add to Home Screen"\n3. Tap "Add"\n\n💻 On Desktop:\n1. Look for install icon in address bar\n2. Or use browser menu → "Install Supapile"'
    );
  };

  const nextPage = () => {
    const totalPages = getTotalPages();
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (index) => {
    setCurrentPage(index);
  };

  const getContent = () => {
    if (isPWAInstalled && !hasExtension) {
      return {
        title: "Complete Your SupaPile Setup!",
        description:
          "You have the app installed! Get our Chrome extension to save links instantly while browsing.",
        showPWAButton: false,
        showExtensionButton: true,
      };
    } else if (!isPWAInstalled && hasExtension) {
      return {
        title: "Install Supapile App! 📱",
        description:
          "You have our extension! Install the app for offline access and faster performance.",
        showPWAButton: true,
        showExtensionButton: false,
      };
    } else {
      return {
        title: "Welcome to Supapile!",
        description:
          "Catch, save and share your favorite links across the web.",
        showPWAButton: true,
        showExtensionButton: true,
      };
    }
  };

  const getPopop = () => {
    if (isPWAInstalled && !hasExtension) {
      return {
        description:
          "If you change your mind, you can find the link to the Chrome Extension at the Update page :)",
      };
    } else if (!isPWAInstalled && hasExtension) {
      return {
        description:
          "If you change your mind, you can find how to download supapile as an app at the Update page :)",
      };
    } else {
      return {
        description:
          "If you change your mind, you can find how to download the PWA and link to the Chrome Extension at the Update page :)",
      };
    }
  };

  const getTotalPages = () => {
    if (!isPWAInstalled && !hasExtension) {
      return features.length + 2;
    } else {
      return 2;
    }
  };

  const renderPage = () => {
    const content = getContent();

    if (currentPage === 0) {
      return (
        <div className="text-center">
          <img
            src={supapile}
            alt="Supapile"
            className="w-20 h-20 mx-auto mb-4"
          />
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            {content.title}
          </h2>
          <p className="text-base text-gray-600 leading-relaxed">
            {content.description}
          </p>
        </div>
      );
    }

    if (!isPWAInstalled && !hasExtension && currentPage <= features.length) {
      const featureIndex = currentPage - 1;
      const feature = features[featureIndex];

      return (
        <div className="text-center">
          <div className={`${feature.color} text-6xl mb-6`}>{feature.icon}</div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
            {feature.title}
          </h3>
          <p className="text-base text-gray-600 leading-relaxed">
            {feature.description}
          </p>
        </div>
      );
    }

    return (
      <div className="text-center">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
          Ready to Get Started?
        </h3>

        <div className="flex justify-center gap-3 mb-6">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
              isPWAInstalled
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            <span>{isPWAInstalled ? "✅" : "⭕"}</span>
            PWA {isPWAInstalled ? "Installed" : "Not Installed"}
          </div>
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
              hasExtension
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            <span>{hasExtension ? "✅" : "⭕"}</span>
            Extension {hasExtension ? "Installed" : "Not Installed"}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {content.showExtensionButton && (
            <button
              onClick={handleGetExtension}
              className="w-full bg-black text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              🧩 Get Chrome Extension
            </button>
          )}

          {content.showPWAButton && (
            <button
              onClick={handleInstallPWA}
              className="w-full bg-gradient-to-r from-[#ff66b2] to-[#ff8c00] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              📱 Install as an App
            </button>
          )}

          <button
            onClick={handleDismiss}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:-translate-y-0.5"
          >
            {isPWAInstalled || hasExtension ? "Got it!" : "Maybe Later"}
          </button>
        </div>
      </div>
    );
  };

  const popUpMessage = getPopop();
  if (!showInfoPopup || isDismissed || (isPWAInstalled && hasExtension)) {
    return (
      <>
        {showDismissMessage && (
          <div
            className="
    fixed 
    bottom-6 left-1/2 transform -translate-x-1/2
    bg-black dark:bg-white text-white dark:text-black
    px-4 py-2 rounded-lg shadow-lg z-[1100]
    text-center
    w-[90%] sm:w-[80%] md:w-[65%] lg:w-[50%] xl:w-[40%]
    text-xs sm:text-sm md:text-base
    transition-all duration-300 ease-in-out opacity-100
    animate-fade-slide
  "
          >
            {popUpMessage.description}
          </div>
        )}
      </>
    );
  }

  const totalPages = getTotalPages();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] flex items-end sm:items-center justify-center">
      <div className="bg-white text-black rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md max-h-[90vh] overflow-hidden shadow-2xl transform transition-all duration-300 ease-out">
        <div className="relative">
          <div className="p-8 min-h-[400px] flex items-center justify-center">
            <div className="w-full max-w-sm">{renderPage()}</div>
          </div>

          {currentPage > 0 && (
            <div className="absolute inset-y-0 left-0 flex items-center">
              <button
                onClick={prevPage}
                className="ml-2 bg-gray-100/60 hover:bg-gray-200/80 backdrop-blur-sm rounded-full p-2 shadow-sm hover:shadow-md transition-all duration-200 opacity-70 hover:opacity-100"
                aria-label="Previous page"
              >
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            </div>
          )}

          {currentPage < totalPages - 1 && (
            <div className="absolute inset-y-0 right-0 flex items-center">
              <button
                onClick={nextPage}
                className="mr-2 bg-gray-100/60 hover:bg-gray-200/80 backdrop-blur-sm rounded-full p-2 shadow-sm hover:shadow-md transition-all duration-200 opacity-70 hover:opacity-100"
                aria-label="Next page"
              >
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => goToPage(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentPage
                      ? "bg-gradient-to-r from-[#ff66b2] to-[#ff8c00] w-8"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="absolute top-4 right-4">
            <div className="bg-black/10 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-gray-600">
              {currentPage + 1} / {totalPages}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallNotification;
