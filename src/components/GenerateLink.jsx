import { useState } from "react";
import useClickedModal from "../zustard/useClickedModal";
import useGenerateLink from "../tanstack-query-hooks/useGenerateLink";
import { X, Copy, Check } from "lucide-react";

const GenerateLink = () => {
  const { mutate, data, isPending } = useGenerateLink();
  const [copied, setCopied] = useState(false);
  const { setTheModal } = useClickedModal();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(data.data);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.log(error);
      console.error("Failed to copy link");
    }
  };

  return (
    <div
      onClick={() => setTheModal()}
      className="relative z-10 h-[100vh] w-[100%] inset-0 cursor-pointer flex justify-center items-center"
    >
      <div onClick={(e)=>e.stopPropagation()} className="bg-white z-[2000] absolute max-sm:bottom-0 dark:text-black rounded-tr-2xl rounded-tl-2xl md:rounded-2xl p-8 w-full max-w-[500px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 ">
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
        <p className="mb-8 leading-relaxed text-[1rem] md:text-lg ">
          Create a secure link to share your public pile with others
        </p>

        {/* Link Generation Section */}
        <div className="space-y-6">
          {!data ? (
            <button
              onClick={mutate}
              disabled={isPending}
              className="w-full py-4 px-6 bg-black 
            hover:bg-gradient-to-r hover:from-pink-500 hover:to-orange-500 
            transition-all text-white font-semibold rounded-xl shadow-lg 
            hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 
            disabled:opacity-70 disabled:cursor-not-allowed"
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
                ) : (
                  "Generate Secure Link"
                )}
              </div>
            </button>
          ) : (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 uppercase tracking-wider">
                Your generated link
              </label>
              <div className="flex items-center gap-2 p-3 rounded-xl border-2 border-gray-200 bg-gray-50 hover:border-gray-300 transition-colors">
                <input
                  type="text"
                  value={data.data}
                  readOnly
                  className="flex-1 bg-transparent text-base text-gray-900 outline-none truncate"
                />
                <button
                  onClick={handleCopyLink}
                  className={`p-2 rounded-md transition-colors ${
                    copied ? "text-black" : "text-gray-500 hover:bg-gray-200"
                  }`}
                  title={copied ? "Copied!" : "Copy link"}
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
        </div>

        {/* Footer Note */}
        <div className="mt-8 pt-6 border-t  border-gray-100">
          <p className="text-sm text-gray-500">
            This link lets anyone view your public piles for the next 1 minute
            only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GenerateLink;
