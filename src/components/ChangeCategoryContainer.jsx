import ChangeCategory from "./ChangeCategory";
import useClickedCategory from "../zustard/useClickedModal";
import GenerateLink from "./GenerateLink";
import ShareModal from "./ShareModal";
const ChangeCategoryContainer = () => {
  const { setTheModal, clicked } = useClickedCategory();
  return (
    <div className="fixed inset-0 bg-black backdrop-blur bg-opacity-50 z-[1000] flex justify-center items-center">
      <div
        onClick={() =>
          setTheModal({ pile: null, isOpen: false, modalType: null })
        }
        className="absolute inset-0 cursor-pointer"
      ></div>
      {clicked.modalType === "changeCategory" ? (
        <ChangeCategory />
      ) : clicked.modalType === "generateLink" ? (
        <GenerateLink />
      ) : clicked.modalType === "share" ? (
        <ShareModal />
      ) : (
        ""
      )}
    </div>
  );
};

export default ChangeCategoryContainer;
