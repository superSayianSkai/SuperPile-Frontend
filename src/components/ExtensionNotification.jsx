import { useState, useEffect } from "react";
import { detectExtension } from "../utils/extensionDetector";
import videoFile from "../assets/video/supapile-1754877229224.mp4";

const ExtensionNotification = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isChrome =
      /Chrome/.test(navigator.userAgent) && /Google Inc/.test(window.chrome);

    if (isMobile && !isChrome) {
      setShowNotification(false);
      return;
    }

    const extensionInstalled = !!window.Supapile;
    if (!extensionInstalled) {
      setShowNotification(true);
    }
    const checkExtension = async () => {
      const dismissed = localStorage.getItem(
        "extension-notification-dismissed"
      );
      const expiredTime = localStorage.getItem("expiryTime")
        ? JSON.parse(localStorage.getItem("expiryTime"))
        : null;
      const now = new Date().getTime();

      // If dismissed and not expired, don't show
      if (dismissed === "true" && expiredTime && now < expiredTime) {
        setIsDismissed(true);
        return;
      }

      // If dismissed but no expiry time set, respect the dismissal
      if (dismissed === "true" && !expiredTime) {
        setIsDismissed(true);
        return;
      }

      // Only check for extension if not dismissed or time has expired
      const hasExtension = await detectExtension();
      if (!hasExtension) {
        setShowNotification(true);
        setIsDismissed(false);

        // Only clear dismissed state if time has actually expired
        if (dismissed === "true" && expiredTime && now > expiredTime) {
          localStorage.setItem("extension-notification-dismissed", "false");
        }
      }
    };

    checkExtension();
  }, []);

  const handleDismiss = () => {
    const now = new Date().getTime();
    const endTime = now + 24 * 60 * 60 * 1000; // 1 minute from now

    setShowNotification(false);
    setIsDismissed(true);
    localStorage.setItem("extension-notification-dismissed", "true");
    localStorage.setItem("expiryTime", JSON.stringify(endTime));
  };

  const handleInstall = () => {
    // Open extension store page
    window.open(
      "https://chrome.google.com/webstore/detail/your-extension-id",
      "_blank"
    );
  };

  if (!showNotification || isDismissed) return null;

  return (
    <div className="fixed inset-0 bg-black backdrop-blur bg-opacity-50 z-[1000]">
      <div className="absolute bottom-0 sm:bottom-auto sm:top-1/2 left-1/2 -translate-x-1/2 sm:-translate-y-1/2 bg-white text-black rounded-tl-2xl rounded-tr-2xl sm:rounded-2xl overflow-hidden shadow-lg z-50 w-full max-w-2xl mx-4 sm:mx-0">
        <div className="flex flex-col items-start gap-3">
          <div className="flex-shrink-0 relative h-[300px] w-[100%] ">
            <video
              src={videoFile}
              autoPlay
              loop
              muted
              playsInline
              disablePictureInPicture
              controlsList="nodownload nofullscreen noremoteplayback"
              className="w-full h-full object-cover pointer-events-none"
              style={{ userSelect: "none" }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-10 pointer-events-none"></div>
          </div>
          <div className="flex-1 p-6  flex flex-col gap-4">
            <h2 className="text-[1.2rem] md:text-2xl font-bold text-gray-900 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">
              Get the Supapile Extension!
            </h2>
            <p className="text-[.9rem] opacity-90 mb-3">
              Install the Supapile browser extension to instantly save links
              from any tab, catch them all without heading back to your
              pileboard.
            </p>
            <div className="flex gap-8 justify-center items-center">
              <button
                onClick={handleInstall}
                className="bg-black  px-4 py-3 text-xs  hover:bg-gray-100  hover:bg-gradient-to-r hover:from-pink-500 hover:to-orange-500 
            transition-all text-white font-semibold rounded-xl shadow-lg 
            hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 
            disabled:opacity-70 disabled:cursor-not-allowed"
              >
                Install Now
              </button>
              <button
                onClick={handleDismiss}
                className="text-black px-4 py-3 rounded-xl bg-gray-100 text-xs shadow-lg hover:bg-gradient-to-r hover:from-pink-500 hover:to-orange-500 hover:text-white transform hover:-translate-y-0.5 active:translate-y-0 
            disabled:opacity-70 disabled:cursor-not-allowed "
              >
                Maybe Later
              </button>
            </div>
          </div>
          {/* <button
            onClick={handleDismiss}
            className="flex-shrink-0 absolute right-0 text-black hover:text-white"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default ExtensionNotification;
