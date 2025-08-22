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
  const { mutate, isPending } = usePostPile(); // Extract isPending from mutation
  const { setPostData } = usePostStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Adding shared link...");

  useEffect(() => {
    const url = searchParams.get("url");

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
            
            // Show success briefly before redirecting
            setTimeout(() => {
              setIsProcessing(false);
              navigate("/", { replace: true });
            }, 1000);
          },
          onError: (error) => {
            const msg = error?.response?.data?.message;
            console.log("API error message:", msg);

            if (msg === "This link already exists in your pile.") {
              setStatusMessage("Link already exists");
              CustomToast("This link already exists in your pile.");
            } else {
              setStatusMessage("Failed to add link");
              CustomToast("Something went wrong. Try again.");
            }
            
            // Redirect after showing error
            setTimeout(() => {
              setIsProcessing(false);
              navigate("/", { replace: true });
            }, 2000);
          },
        }
      );

      console.log("Link being processed:", { url });
    } else {
      // No URL shared, redirect to home immediately
      setStatusMessage("No link to process");
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1000);
    }
  }, [searchParams, navigate, mutate, queryClient, setPostData]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        {(isPending || isProcessing) ? (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-600">{statusMessage}</p>
          </>
        ) : (
          <>
            <div className="h-12 w-12 mx-auto mb-4 flex items-center justify-center">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <p className="text-gray-600">{statusMessage}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default ShareHandler;
