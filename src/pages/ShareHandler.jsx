import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { usePostStore } from "../zustard/usePostStore";
import usePostPile from "../tanstack-query-hooks/usePostPile";
import CustomToast from "../components/ShowCustomToast";
import { useQueryClient } from "@tanstack/react-query";
const ShareHandler = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { mutate, isPending } = usePostPile();
  const { setPostData } = usePostStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Processing shared link...");

  // Function to extract and validate URL
  const extractAndValidateUrl = (rawUrl) => {
    if (!rawUrl) return null;

    let cleanUrl = rawUrl.trim();

    // Handle malformed URLs like "hrttps////example.com" or "take a look hrttps////..."
    // Extract URL from text that might contain prefixes
    const urlMatch = cleanUrl.match(/(https?:\/\/[^\s]+)/i);
    if (urlMatch) {
      cleanUrl = urlMatch[1];
    }

    // Fix common malformed patterns
    cleanUrl = cleanUrl
      .replace(/^hrttps?:\/+/i, 'https://') // Fix hrttps://// -> https://
      .replace(/^https?:\/+/i, (match) => {
        return match.toLowerCase().startsWith('https') ? 'https://' : 'http://';
      })
      .replace(/\/+/g, '/') // Replace multiple slashes with single slash
      .replace(/:(\/[^/])/g, '://$1'); // Fix protocol formatting

    // Validate URL format
    try {
      const url = new URL(cleanUrl);
      
      // Enforce HTTPS only
      if (url.protocol !== 'https:') {
        return { error: 'Only HTTPS URLs are allowed for security reasons.' };
      }

      return { url: url.href };
    } catch (error) {
      return { error: 'Invalid URL format.' };
    }
  };

  useEffect(() => {
    // Try multiple common parameter names used by different apps
    const rawUrl = searchParams.get("url") || 
                   searchParams.get("text") || 
                   searchParams.get("link") || 
                   searchParams.get("u") ||
                   searchParams.get("href") ||
                   searchParams.get("uri") ||
                   searchParams.get("body");

    const urlResult = extractAndValidateUrl(rawUrl);

    if (urlResult?.error) {
      // Show error for invalid or HTTP URLs
      setStatusMessage(urlResult.error);
      CustomToast(urlResult.error);
      
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 3000);
      return;
    }

    if (urlResult?.url) {
      setIsProcessing(true);
      setStatusMessage("Adding shared link...");

      // Add to your pile/collection using the mutate function
      mutate(
        { url: urlResult.url, category: "all" },
        {
          onSuccess: (data) => {
            if (data?.message === "This link already exists in your pile.") {
              setStatusMessage("Link already exists in your pile");
              CustomToast("This link is already in your pile.");
              setTimeout(() => {
                setIsProcessing(false);
                navigate("/", { replace: true });
              }, 1500);
              return;
            }

            setStatusMessage("Link added successfully!");
            setPostData(data);
            queryClient.setQueryData(["user"], (prev) => prev);
            queryClient.invalidateQueries({ queryKey: ["pile"], exact: false });
            
            setTimeout(() => {
              setIsProcessing(false);
              navigate("/", { replace: true });
            }, 1000);
          },
          onError: (error) => {
            const msg = error?.response?.data?.message;

            if (msg === "This link already exists in your pile.") {
              setStatusMessage("Link already exists");
              CustomToast("This link already exists in your pile.");
            } else {
              setStatusMessage("Failed to add link");
              CustomToast("Something went wrong. Try again.");
            }
            
            setTimeout(() => {
              setIsProcessing(false);
              navigate("/", { replace: true });
            }, 2000);
          },
        }
      );
    } else {
      // No URL found
      setStatusMessage("No valid link to process");
      CustomToast("No valid link found to add to your pile.");
      
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 2000);
    }
  }, [searchParams, navigate, mutate, queryClient, setPostData]);

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="text-center max-w-md mx-auto">
        {(isPending || isProcessing) ? (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-600 mb-4">{statusMessage}</p>
          </>
        ) : statusMessage.includes("successfully") ? (
          <>
            <div className="h-12 w-12 mx-auto mb-4 flex items-center justify-center">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
            </div>
            <p className="text-gray-600 mb-4">{statusMessage}</p>
          </>
        ) : (
          <>
            <div className="h-12 w-12 mx-auto mb-4 flex items-center justify-center">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">!</span>
              </div>
            </div>
            <p className="text-gray-600 mb-4">{statusMessage}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default ShareHandler;
