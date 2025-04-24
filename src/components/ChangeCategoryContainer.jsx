import ChangeCategory from "./ChangeCategory";
import useClickedCategory from "../zustard/useClickedCategory";
const ChangeCategoryContainer = () => {

  const {setTheClickedPile}=useClickedCategory()
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex justify-center items-center">
      <div
        onClick={() => setTheClickedPile("")}
        className="absolute inset-0 cursor-pointer"
      ></div>
      <ChangeCategory />
    </div>
  );
};

export default ChangeCategoryContainer;
