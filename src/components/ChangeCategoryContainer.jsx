import { useEffect } from "react";
import ChangeCategory from "./ChangeCategory";
import useClickedCategory from "../zustard/useClickedModal";
import GenerateLink from "./GenerateLink";
import ShareModal from "./ShareModal";

const ChangeCategoryContainer = () => {
  const { clicked } = useClickedCategory();
  console.log("Jesus Loves me");
  console.log(clicked);
  
  useEffect(() => {
    // Prevent body scroll when modal is open
    document.documentElement.style.overflow = 'hidden';
    document.body.scroll = "no";
    
    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.documentElement.style.overflow = 'auto';
      document.body.scroll = "yes";
    };
  }, []);
  
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed inset-0 bg-black backdrop-blur bg-opacity-50 z-[1000] h-screen max-h-screen"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="overflow-y-hidden"
      >
        {clicked.modalType === "changeCategory" ? (
          <ChangeCategory />
        ) : clicked.modalType === "generateLink" ? (
          <GenerateLink />
        ) : clicked.modalType === "share" ?(
          <ShareModal pile={clicked?.url} />
        ) : (
          null
        )}
      </div>
    </div>
  );
};

export default ChangeCategoryContainer;