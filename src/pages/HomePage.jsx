import Hero from "../components/Hero";
import PileBoard from "../components/PileBoard";
import { useContext, useEffect, useState } from "react";
import { StateContext } from "../context/SupaPileContext";
import PilePanel from "../components/PilePanel";
import { useAuthStore } from "../zustard/useAuthStore";
import { useLocation, useNavigate } from "react-router-dom";
import usePostPile from "../tanstack-query-hooks/usePostPile";
import useFetchPile from "../tanstack-query-hooks/useFetchPile";
import { useQueryClient } from "@tanstack/react-query";

const HomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user: userData } = useAuthStore();
  const { LinkBoardPanel } = useContext(StateContext);
  const { mutate: postMutate } = usePostPile(); // Remove the empty object
  const [isProcessing, setIsProcessing] = useState(false);

  // Get existing piles data to check for duplicates
  const { data: pileData } = useFetchPile({ category: "all", keyword: "" });

  // Extract URL from pathname
  const magic = location.pathname.startsWith("/magic-save/")
    ? location.pathname.replace("/magic-save/", "")
    : null;

  useEffect(() => {
    if (magic && userData && !isProcessing) { // Add userData check back
      // Immediately navigate to home to clear the URL from address bar
      navigate("/", { replace: true });

      // Add protocol if missing
      let url = magic;
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
      }

      // Check if URL already exists in piles
      const allPiles = pileData?.pages?.flatMap((page) => page.piles) || [];
      const existingPile = allPiles.find((pile) => pile.url === url);

      if (existingPile) {
        console.log("Link already exists:", url);
        return;
      }

      // Check if we've already processed this URL in this session
      const processedUrls = JSON.parse(
        sessionStorage.getItem("processedUrls") || "[]"
      );
      if (processedUrls.includes(url)) {
        console.log("Link already processed in this session:", url);
        return;
      }

      setIsProcessing(true);

      // Add URL to processed list
      processedUrls.push(url);
      sessionStorage.setItem("processedUrls", JSON.stringify(processedUrls));

      // Save the link automatically
      postMutate(
        { url: url, category: "all" },
        {
          onSuccess: (data) => {
            console.log("Link saved successfully!", data);
            setIsProcessing(false);
            sessionStorage.setItem(`processed_${url}`, 'true');
          },
          onError: (error) => {
            console.error("Error saving link:", error);
            setIsProcessing(false);
            sessionStorage.removeItem(`processed_${url}`);
          }
        }
      );
    }
  }, [magic, userData, navigate, pileData, isProcessing, postMutate]);

  // Show processing message briefly if we just processed a magic save
  if (isProcessing) {
    return (
      <div className="bg-white dark:bg-black dark:text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-lg">Saving link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-black dark:text-white ">
      <div
        className={`flex flex-col dark:bg-black relative ${
          LinkBoardPanel && userData ? "overflow-hidden" : ""
        } `}
      >
        <>
          <Hero />
          <PileBoard />
          {LinkBoardPanel && <PilePanel />}
        </>
      </div>
    </div>
  );
};

export default HomePage;
