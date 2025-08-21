import { useState, useEffect } from "react";
import useClickedModal from "../zustard/useClickedModal";
import useGenerateLink from "../tanstack-query-hooks/useGenerateLink";
import useGetCurrentLink from "../tanstack-query-hooks/useGetCurrentLink";
import { X, Copy, Check, Clock } from "lucide-react";

const GenerateLink = () => {
  const { mutate, data: generateData, isPending, error } = useGenerateLink();
  const { data: currentLinkData, isFetching: isCheckingCurrent } = useGetCurrentLink();
  const [copied, setCopied] = useState(false);
  const [selectedExpiry, setSelectedExpiry] = useState("2.5min");
  const { setTheModal } = useClickedModal();

  // console.log("solo leveling")
  // console.log(currentLinkData)
  // Expiry options that match backend
  const expiryOptions = [
    { value: "2.5min", label: "2.5 Minutes", duration: 150 },
    { value: "1hr", label: "1 Hour", duration: 3600 },
    { value: "24hr", label: "24 Hours", duration: 86400 },
  ];

  console.log("baby girl you know what i want")
  console.log(`check this out :${currentLinkData?.success}`)
  const activeLink = currentLinkData?.success
    ? currentLinkData
    : null;
    console.log(`check this out :`, activeLink?.data)
  const hasActiveLink = activeLink?.success && activeLink?.data;

  // Calculate time left from the active link
  const calculateTimeLeft = (expiresAt) => {
    if (!expiresAt) return 0;
    const now = Date.now();
    const timeLeft = expiresAt - now;
    return timeLeft > 0 ? Math.floor(timeLeft / 1000) : 0;
  };

  const [timeLeft, setTimeLeft] = useState(0);

  // Calculate initial time left
  useEffect(() => {
    if (hasActiveLink) {
      const initialTimeLeft = calculateTimeLeft(activeLink.expiresAt);
      setTimeLeft(initialTimeLeft);
    }
  }, [hasActiveLink, activeLink?.expiresAt]);

  // Update time every second
  useEffect(() => {
    if (!hasActiveLink || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        const newTimeLeft = prev - 1;
        return newTimeLeft > 0 ? newTimeLeft : 0;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [hasActiveLink, timeLeft > 0]);

  const handleGenerateNewLink = (expiryOption = selectedExpiry) => {
    mutate(
      { expiryOption },
      {
        onMutate: () => {
          setCopied(false);
        },
        onError: (error) => {
          console.error("Failed to generate new link:", error);
        },
      }
    );
  };

  const handleCopyLink = async () => {
    try {
      // Primary method: Modern clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(activeLink.data);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Fallback method for older browsers or non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = activeLink.data;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error('Fallback copy failed:', err);
          // Show user-friendly error message
          alert('Copy failed. Please manually select and copy the link.');
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (error) {
      console.error('Copy failed:', error);
      // Show user-friendly error message
      alert('Copy failed. Please manually select and copy the link.');
    }
  };

  // Format time display
  const formatTimeLeft = (seconds) => {
    if (seconds >= 3600) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
    } else if (seconds >= 60) {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${minutes}m ${secs}s`;
    } else {
      return `${seconds}s`;
    }
  };

  // Update time every second when there's an active link
  useEffect(() => {
    if (!hasActiveLink || timeLeft <= 0) return;

    const interval = setInterval(() => {
      // Force re-render to recalculate timeLeft
      // This is intentionally empty as timeLeft is calculated from activeLink.expiresAt
    }, 1000);

    return () => clearInterval(interval);
  }, [hasActiveLink]); // Remove timeLeft from dependency array

  return (
    <div
      onClick={() => setTheModal()}
      className="relative z-10 h-[100svh] w-[100%] inset-0 cursor-pointer flex justify-center items-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white z-[2000] absolute max-sm:bottom-0 dark:text-black rounded-tr-2xl rounded-tl-2xl md:rounded-2xl px-7 py-8 w-full max-w-[550px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] transform transition-all"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h2 className="text-[1.2rem] md:text-2xl font-bold text-gray-900 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">
              Generate Share Link
            </h2>
          </div>
          <button
            onClick={() => setTheModal("")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Description */}
        <p className="mb-8 leading-relaxed text-[1rem] md:text-lg">
          Create a secure link to share your public pile with others
        </p>

        {/* Loading state while checking for current link */}
        {isCheckingCurrent && !currentLinkData && (
          <div className="flex items-center justify-center py-8">
            <svg
              className="animate-spin h-8 w-8 text-pink-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="ml-2 text-gray-600">
              Checking for existing link...
            </span>
          </div>
        )}

        {/* Link Generation Section */}
        {!isCheckingCurrent || generateData || currentLinkData ? (
          <div className="space-y-6">
            {/* Error Message Display */}
            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                    <X className="w-3 h-3 text-white" />
                  </div>
                  <p className="text-red-700 font-medium">
                    Error generating link
                  </p>
                </div>
                <p className="text-red-600 text-sm mt-1 ml-7">
                  {error?.response?.data?.message ||
                    error?.message ||
                    "Something went wrong. Please try again."}
                </p>
              </div>
            )}

            {/* Show active link */}
            {hasActiveLink && timeLeft > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700 uppercase tracking-wider">
                    Active Link
                  </label>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600 font-medium">
                      <div className="flex justify-center  items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 animate-pulse"></div>
                        {`${formatTimeLeft(timeLeft)} left`}
                      </div>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-full border-[1px] border-gray-200 bg-gray-50">
                  <input
                    type="text"
                    value={activeLink.data}
                    readOnly
                    className="flex-1 bg-transparent text-base outline-none truncate text-gray-900"
                  />

                  <button
                    onClick={handleCopyLink}
                    className={`p-2 rounded-md transition-colors ${
                      copied
                        ? "text-pink-400"
                        : "text-gray-500 hover:bg-gray-200"
                    }`}
                    title={copied ? "Copied!" : "Copy link"}
                    disabled={isCheckingCurrent}
                  >
                    {copied ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {copied && (
                  <div className="flex items-center gap-2 text-sm animate-fade-in">
                    <span className="text-transparent bg-gradient-to-r from-pink-500 ml-2 to-orange-500 bg-clip-text">
                      Link copied to clipboard!
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Expiry Time Selection - Always show */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 uppercase tracking-wider">
                <Clock className="w-4 h-4 inline mr-2" />
                {hasActiveLink && timeLeft > 0
                  ? "New Link Duration"
                  : "Link Duration"}
              </label>
              <div className="grid grid-cols-3 gap-3">
                {expiryOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedExpiry(option.value)}
                    className={`relative p-3 rounded-full transition-all text-[.6rem] sm:text-sm font-medium ${
                      selectedExpiry === option.value
                        ? "bg-gradient-to-r from-pink-50 to-orange-50 text-black"
                        : "border-2 border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {selectedExpiry === option.value && (
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 p-[2px]">
                        <div className="h-full w-full rounded-full bg-gradient-to-r from-pink-50 to-orange-50"></div>
                      </div>
                    )}
                    <span className="relative z-10">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate/Regenerate Button */}
            <button
              onClick={() => handleGenerateNewLink()}
              disabled={isPending}
              className="w-full py-4 px-6 bg-black hover:bg-gradient-to-r hover:from-pink-500 hover:to-orange-500 transition-all text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed text-[.8rem] sm:text-[1rem]"
            >
              <div className="flex items-center justify-center gap-2">
                {isPending ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Generating...
                  </>
                ) : hasActiveLink && timeLeft > 0 ? (
                  `Generate New Link (${
                    expiryOptions.find((opt) => opt.value === selectedExpiry)
                      ?.label
                  })`
                ) : (
                  `Generate Link (${
                    expiryOptions.find((opt) => opt.value === selectedExpiry)
                      ?.label
                  })`
                )}
              </div>
            </button>
          </div>
        ) : null}

        {/* Footer Note */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            This link lets anyone view your public piles for the selected
            duration only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GenerateLink;
