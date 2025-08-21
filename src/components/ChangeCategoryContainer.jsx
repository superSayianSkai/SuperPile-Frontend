import ChangeCategory from "./ChangeCategory";
import useClickedCategory from "../zustard/useClickedModal";
import GenerateLink from "./GenerateLink";
import ShareModal from "./ShareModal";
const ChangeCategoryContainer = () => {
  const { clicked } = useClickedCategory();
  console.log("Jesus Loves me");
  console.log(clicked);
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed inset-0 bg-black backdrop-blur bg-opacity-50 z-[1000] h-screen max-h-screen overflow-hidden"
    >
      <div onClick={(e) => e.stopPropagation()} className="h-full overflow-y-auto">
        {clicked.modalType === "changeCategory" ? (
          <ChangeCategory />
        ) : clicked.modalType === "generateLink" ? (
          <GenerateLink />
        ) : clicked.modalType === "share" ? (
          <ShareModal pile={clicked?.url} />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default ChangeCategoryContainer;
