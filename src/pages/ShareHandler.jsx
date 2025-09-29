import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import usePostPile from "../tanstack-query-hooks/usePostPile";
import { usePostStore } from "../zustard/usePostStore";
import CustomToast from "../components/ShowCustomToast";
import { Helmet } from "react-helmet-async";

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
      .replace(/^hrttps?:\/+/i, 'https://') 
      .replace(/^https?:\/+/i, (match) => {
        return match.toLowerCase().startsWith('https') ? 'https://' : 'http://';
      })
      .replace(/\/+/g, '/') // Replace multiple slashes with single slash
      .replace(/:(\/[^/])/g, '://$1'); // Fix protocol formatting
  
    // Validate URL format
    try {
      const url = new URL(cleanUrl);
      
      // More lenient HTTPS check - allow both HTTP and HTTPS for now
      if (url.protocol !== 'https:' && url.protocol !== 'http:') {
        return { error: 'Invalid URL protocol. Only HTTP and HTTPS are supported.' };
      }
  
      // Convert HTTP to HTTPS for security (optional warning)
      if (url.protocol === 'http:') {
        url.protocol = 'https:';
        console.warn('Converting HTTP to HTTPS for security:', url.href);
      }
  
      return { url: url.href };
    } catch (error) {
      console.error('URL validation error:', error);
      return { error: 'Invalid URL format. Please check the URL and try again.' };
    }
  };

  useEffect(() => {
    try {
      // Try multiple common parameter names used by different apps
      const rawUrl = searchParams.get("url") || 
                     searchParams.get("text") || 
                     searchParams.get("link") || 
                     searchParams.get("u") ||
                     searchParams.get("href") ||
                     searchParams.get("uri") ||
                     searchParams.get("body");
  
      console.log('Raw URL from params:', rawUrl);
  
      const urlResult = extractAndValidateUrl(rawUrl);
      console.log('URL validation result:', urlResult);
  
      if (urlResult?.error) {
        // Show error for invalid URLs
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
              console.error('Mutation error:', error);
              console.error('Full error object:', JSON.stringify(error, null, 2));
              console.error('Error response data:', error?.response?.data);
              console.error('Error message:', error?.response?.data?.message);
              
              const msg = error?.response?.data?.message;
  
              // Check for duplicate link messages (more flexible matching)
              const isDuplicateLink = msg && (
                msg.toLowerCase().includes("already exists") ||
                msg.toLowerCase().includes("duplicate") ||
                msg === "This link already exists in your pile." ||
                msg === "This link already exists in your pile" ||
                msg.includes("already exists in your pile")
              );
  
              if (isDuplicateLink) {
                setStatusMessage("Link already exists in your pile");
                CustomToast("This link is already in your pile.");
              } else {
                setStatusMessage("Failed to add link");
                CustomToast(msg || "Something went wrong. Please try again.");
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
    } catch (error) {
      console.error('ShareHandler error:', error);
      setStatusMessage("An unexpected error occurred");
      CustomToast("An unexpected error occurred. Please try again.");
      
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 3000);
    }
  }, [searchParams, navigate, mutate, queryClient, setPostData]);

  return (
    <>
      <Helmet>
        <title>Processing Shared Link - Supapile.com</title>
        
        {/* Description for Google and social previews */}
        <meta
          name="description"
          content="Processing a shared link to add to your Supapile collection. Save and organize URLs from anywhere on the web with Supapile.com."
        />

        {/* Keywords for better SEO */}
        <meta name="keywords" content="share to supapile, save link, add bookmark, supapile.com, link sharing" />

        {/* Open Graph tags */}
        <meta
          property="og:title"
          content="Processing Shared Link - Supapile.com"
        />
        <meta
          property="og:description"
          content="Processing a shared link to add to your Supapile collection. Save and organize URLs from anywhere."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.supapile.com/share" />
        <meta property="og:image" content="https://supapile.com/og-image.png" />
        <meta property="og:site_name" content="Supapile" />

        {/* Twitter card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Processing Shared Link - Supapile.com"
        />
        <meta
          name="twitter:description"
          content="Processing a shared link to add to your Supapile collection."
        />
        <meta
          name="twitter:image"
          content="https://supapile.com/og-image.png"
        />

        {/* Additional SEO tags */}
        <meta name="robots" content="noindex, nofollow" />
        <meta name="author" content="Supapile" />
      </Helmet>

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
    </>
  );
};

export default ShareHandler;
