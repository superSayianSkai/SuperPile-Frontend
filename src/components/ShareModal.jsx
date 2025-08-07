import { useState, useEffect, useRef } from "react";
import useClickedModal from "../zustard/useClickedModal";
import { X, Link as LinkIcon, Copy } from "lucide-react";

const ShareModal = ({ pile }) => {
  const { setTheModal } = useClickedModal();
  const [copied, setCopied] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [includeStartTime, setIncludeStartTime] = useState(false);
  const modalRef = useRef(null);

  const videoUrl = pile;
  const currentUrl =
    includeStartTime && startTime ? `${videoUrl}&t=${startTime}` : videoUrl;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOptions = [
    {
      //   name: "WhatsApp",
      icon: <i className="bi bi-whatsapp text-[30px] text-white"></i>,
      color: "bg-[#25D366] hover:bg-green-600",
      action: () =>
        window.open(
          `https://wa.me/?text=${encodeURIComponent(currentUrl)}`,
          "_blank"
        ),
    },
    {
      //   name: "X",
      icon: <i className="bi bi-twitter-x text-[30px] text-white"></i>,
      color: "bg-black hover:bg-gray-800",
      action: () =>
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            currentUrl
          )}`,
          "_blank"
        ),
    },
    {
      //   name: "Facebook",
      icon: <i className="bi bi-facebook text-[30px] text-white"></i>,
      color: "bg-[#1877F2] hover:bg-blue-700",
      action: () =>
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            currentUrl
          )}`,
          "_blank"
        ),
    },
    {
      //   name: "LinkedIn",
      icon: <i className="bi bi-linkedin text-[30px] text-white"></i>,
      color: "bg-[#0077B5] hover:bg-[#004182]",
      action: () =>
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            currentUrl
          )}`,
          "_blank"
        ),
    },
    {
      name: "Copy",
      icon: copied ? (
        <Copy className="w-5 h-5 color" />
      ) : (
        <LinkIcon className="w-5 h-5" />
      ),
      color: "bg-gray-100 hover:bg-gray-200 border border-gray-300",
      action: handleCopy,
    },
  ];

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setTheModal();
      }
    };
    console.log("trying to close ");
    // Attach the event listener to the document
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setTheModal]);

  return (
      <div
        onClick={() => setTheModal()}
        className="relative z-10 h-[100vh] w-[100%] inset-0 cursor-pointer flex justify-center items-center"
      >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="bg-white max-sm:absolute max-sm:bottom-0 rounded-tr-xl rounded-tl-xl max-sm:pb-2 md:rounded-xl dark:text-black shadow-2xl z-10 w-full max-w-md overflow-hidden animate-fade-in "
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Share Pile</h3>
          <button
            onClick={setTheModal}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* URL Preview */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Link to share
              </span>
            </div>

            <div className="relative">
              <input
                type="text"
                value={currentUrl}
                readOnly
                className="w-full px-4 py-2 pr-10 bg-gray-50 border border-gray-300 rounded-lg text-sm truncate"
              />
              <button
                onClick={handleCopy}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {copied ? (
                  <span className="text-white bg-black p-1 text-sm font-medium">
                    Copied!
                  </span>
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Share Options */}
          <div className="">
            <h4 className="text-sm font-medium text-gray-700 mb-4">
              Share via
            </h4>
            <div className="grid grid-cols-5 gap-3">
              {shareOptions.map((option) => (
                <button
                  key={option.name}
                  onClick={option.action}
                  className={`flex rounded-full h-[60px] w-[60px]  flex-col items-center justify-center p-3  transition-all ${option.color}`}
                >
                  <div className="hover:opacity-70">{option.icon}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
