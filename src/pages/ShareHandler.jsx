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
  const [statusMessage, setStatusMessage] = useState("Adding shared link...");
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    // Get all parameters for debugging
    const allParams = Object.fromEntries(searchParams);
    const currentUrl = window.location.href;
    
    // Try multiple common parameter names used by different apps
    const url = searchParams.get("url") || 
                searchParams.get("text") || 
                searchParams.get("link") || 
                searchParams.get("u") ||
                searchParams.get("href") ||
                searchParams.get("uri") ||
                searchParams.get("body");
    
    // Set debug info to display on screen
    setDebugInfo({
      currentUrl,
      allParams,
      extractedUrl: url,
      parameterKeys: Object.keys(allParams)
    });

    if (url) {
      setIsProcessing(true);
      setStatusMessage("Processing shared link...");

      // Add to your pile/collection using the mutate function
      mutate(
        { url, category: "all" },
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
      // No URL found - show debug info
      setStatusMessage("No link found - Debug Mode");
      
      // Don't redirect immediately, let user see debug info
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 10000); // 10 seconds to read debug info
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
        
        {/* Debug Information Display */}
        {debugInfo && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg text-left text-xs">
            <h3 className="font-bold mb-2 text-center">Debug Info (Mobile)</h3>
            
            <div className="mb-3">
              <strong>Current URL:</strong>
              <div className="break-all bg-white p-2 rounded mt-1">
                {debugInfo.currentUrl}
              </div>
            </div>
            
            <div className="mb-3">
              <strong>Found Parameters:</strong>
              <div className="bg-white p-2 rounded mt-1">
                {debugInfo.parameterKeys.length > 0 ? (
                  debugInfo.parameterKeys.map(key => (
                    <div key={key} className="mb-1">
                      <span className="font-mono">{key}:</span> {debugInfo.allParams[key]}
                    </div>
                  ))
                ) : (
                  <span className="text-red-500">No parameters found</span>
                )}
              </div>
            </div>
            
            <div className="mb-3">
              <strong>Extracted URL:</strong>
              <div className="bg-white p-2 rounded mt-1">
                {debugInfo.extractedUrl || <span className="text-red-500">None found</span>}
              </div>
            </div>
            
            <div className="text-center mt-4 text-gray-500">
              Redirecting in 10 seconds...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareHandler;
