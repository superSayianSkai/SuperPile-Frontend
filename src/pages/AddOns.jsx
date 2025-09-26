import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Chrome,
  Smartphone,
  Globe,
  Zap,
  Shield,
  RefreshCw,
  InfoIcon,
  Check,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import supapile from "../assets/supapile-icon2.svg";
import { Link } from "react-router-dom";
const AddOns = () => {
  const [isPWAInstalled, setIsPWAInstalled] = useState(false);
  const [hasExtension, setHasExtension] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  // Check installation status
  useEffect(() => {
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
        !!window.chrome?.runtime?.getManifest?.()?.name?.includes("Supapile")
      );
    };

    setIsPWAInstalled(checkPWAInstalled());
    setHasExtension(checkExtensionInstalled());

    // Listen for PWA install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleGetExtension = () => {
    window.open(
      "https://chromewebstore.google.com/detail/supapile/dijfgnlpkjppccgkiapcppdkeiekemah",
      "_blank"
    );
  };

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsPWAInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback instructions
      alert(
        'To install Supapile as an app:\n\n📱 On Mobile:\n1. Tap browser menu (⋮)\n2. Select "Add to Home Screen"\n3. Tap "Add"\n\n💻 On Desktop:\n1. Look for install icon in address bar\n2. Or use browser menu → "Install Supapile"'
      );
    }
  };

 
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-black dark:via-gray-900 dark:to-black">
      <Helmet>
        <title>Downloads - Get Supapile Extension & App</title>
        <meta
          name="description"
          content="Download the Supapile Chrome extension and install the PWA app. Save, organize and share your favorite URLs with ease across all your devices."
        />
        <meta
          name="keywords"
          content="supapile download, chrome extension, PWA app, link manager, bookmark tool"
        />

        <meta
          property="og:title"
          content="Downloads - Get Supapile Extension & App"
        />
        <meta
          property="og:description"
          content="Download the Supapile Chrome extension and install the PWA app for the best link management experience."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.supapile.com/downloads" />
        <meta property="og:image" content="https://supapile.com/og-image.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Downloads - Get Supapile Extension & App"
        />
        <meta
          name="twitter:description"
          content="Download the Supapile Chrome extension and install the PWA app for the best link management experience."
        />
        <meta
          name="twitter:image"
          content="https://supapile.com/og-image.png"
        />
      </Helmet>

      {/* Back Navigation */}
      <div className="absolute -4 top-8 z-10">
        <button
          onClick={handleGoBack}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img
                src={supapile}
                alt="Supapile"
                className="relative w-20 h-20 mx-auto"
              />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
              Get Supapile
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Choose your preferred way to access Supapile. Install the extension
            for quick link saving or get the PWA for the full experience.
          </p>

        </div>

        {/* Download Options */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Chrome Extension Card */}
          <div className="group relative">
            <div className="absolute inset-0 rounded-2xl blur-xl  transition-opacity duration-500"></div>
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-8 transition-all duration-300 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-r from-pink-500 to-orange-500 rounded-xl">
                  <Chrome className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Extension
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    For quick link saving
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 dark:text-gray-300">
                    Save and organize your favorite links without opening the
                    site
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 dark:text-gray-300">
                    Optimized for secure browsing (HTTPS only)
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 dark:text-gray-300">
                    Compatible with Chrome, Edge, Brave, Opera, Vivaldi, and
                    Yandex — more coming soon!
                  </p>
                </div>
              </div>

              <div className="gap-8 mb-10">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">
                  Installation Instructions
                </h2>
                <div className="flex flex-col">
                  <ol className="space-y-3 text-gray-700 dark:text-gray-300">
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        1
                      </span>
                      Click &quot;Add to Chrome&quot; button
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        2
                      </span>
                      Confirm installation in Chrome Web Store
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        3
                      </span>
                      Pin the extension to your toolbar
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        4
                      </span>
                      Start saving links with one click!
                    </li>
                  </ol>
                </div>
              </div>

              <button
                onClick={handleGetExtension}
                disabled={hasExtension}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                  hasExtension
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-pink-500 to-orange-500 text-white hover:shadow-lg hover:shadow-pink-500/25"
                }`}
              >
                {hasExtension ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-green" />
                    </div>
                    Already Installed
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Download className="w-5 h-5" />
                    Add to browser
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* PWA App Card */}
          <div className="group relative">
            <div className="absolute inset-0 rounded-2xl blur-xl duration-500"></div>
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-8 transition-all duration-300 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-black  rounded-xl">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Progressive Web App
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Full app experience
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-black dark:bg-white rounded-full mt-2"></div>
                  <p className="text-gray-700 dark:text-gray-300">
                    Works offline with cached data
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-black dark:bg-white rounded-full mt-2"></div>
                  <p className="text-gray-700 dark:text-gray-300">
                    Native app-like experience
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-black dark:bg-white rounded-full mt-2"></div>
                  <p className="text-gray-700 dark:text-gray-300">
                    Push notifications support
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-black dark:bg-white rounded-full mt-2"></div>
                  <p className="text-gray-700 dark:text-gray-300">
                    Install on any device
                  </p>
                </div>
              </div>
              <div className="gap-8 mb-10">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">
                  Installation Instructions
                </h2>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      📱 On Mobile
                    </h4>
                    <ol className="space-y-3 text-gray-700 dark:text-gray-300">
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                          1
                        </span>
                        Tap browser menu (⋮)
                      </li>
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                          2
                        </span>
                        Select "Add to Home Screen"
                      </li>
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                          3
                        </span>
                        Tap "Add" to confirm
                      </li>
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      💻 On Desktop
                    </h4>
                    <ol className="space-y-3 text-gray-700 dark:text-gray-300">
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                          1
                        </span>
                        Look for install icon in address bar
                      </li>
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                          2
                        </span>
                        Or use browser menu → "Install Supapile"
                      </li>
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                          3
                        </span>
                        Follow the installation prompts
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
              <button
                onClick={handleInstallPWA}
                disabled={isPWAInstalled}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                  isPWAInstalled
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    : "bg-black dark:bg-white text-white dark:text-black"
                }`}
              >
                {isPWAInstalled ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-green" />
                      </div>
                      Already Installed
                    </span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Download className="w-5 h-5" />
                    Install App
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <footer className="p-6 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="flex max-sm:flex-col max-sm:justify-center justify-between items-center text-center">
            <Link
              to="/updates"
              className="flex items-center justify-center gap-1 mb-2 hover:underline cursor-pointer hover:opacity-100 transition-opacity duration-200"
            >
              <InfoIcon className="h-4 w-4 sm:mt-1 " />
              <div className="font-bold text-[.8rem] sm:text-2xl bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
                updates
              </div>
            </Link>
            <div className="text-gray-700 dark:text-gray-300 flex items-center gap-3 text-[.8rem] sm:text-sm md:text-base">
              all your URLS
              <span className="text-orange-500 text-2xl ">•</span>
              in one place
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AddOns;
