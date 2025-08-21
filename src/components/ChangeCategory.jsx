import { useFetchCategory } from "../tanstack-query-hooks/useFetchCategory.js";
import useCategoryChanger from "../zustard/useCategoryChanger.js";
import { useState } from "react";
import useClickedModal from "../zustard/useClickedModal.js";
import useChangeCategory from "../tanstack-query-hooks/useChangeCategory.js";
import CustomToast from "./ShowCustomToast.jsx";
const ChangeCategory = () => {
  const { data } = useFetchCategory();
  const { setTheCategoryChangerStore } = useCategoryChanger();
  const { clicked } = useClickedModal();
  const [clickedState, setClickedState] = useState();
  const [toast, setToast] = useState({ show: false, message: "" });
  const { setTheModal } = useClickedModal();
  const showCustomToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 3000);
  };

  const category = data?.data.categories;

  const { mutate } = useChangeCategory();
  let clickedPileCategory = clicked.pile;
  console.log(clickedPileCategory)
  console.log("hahahahah");
  const handleChange = async (e) => {
    console.log(e);
    const ticked = e.target.value;
    console.log("hey brother");
    console.log(ticked);
    setTheCategoryChangerStore(ticked);
    mutate(
      {
        _id: clickedPileCategory._id,
        category: ticked, // ✅ new category
        fromCategory: clicked.pile.category,
        keyword: "",
      },
      {
        onSuccess: (res) => {
          setClickedState(ticked);
          showCustomToast(res?.data || "Category changed successfully");
        },
      }
    );
  };

  return (
    <div
      onClick={() => setTheModal()}
      className="relative z-10  w-[100%] rounded-xl h-[100svh] overflow-y-scroll inset-0 cursor-pointer flex justify-center items-center"
    >
      <div onClick={(e) => e.stopPropagation()} className="w-[90%]  md:w-[400px] h-[400px] rounded-xl overflow-scroll">
        <div className="bg-white rounded-xl shadow-md p-4 flex flex-col z-[2000]">
          <h1 className="text-sm font-semibold text-gray-700 mb-3 text-center">
            Change Category
          </h1>

          <div className="overflow-y-auto custom-scroll flex-1 space-y-1 pr-1 cursor-pointer">
            {category
              ?.slice()
              .reverse()
              .map((c, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-2 py-2 rounded-md hover:bg-gray-100 cursor-pointer transition"
                >
                  <label className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer w-[100%]">
                    <input
                      type="radio"
                      name="category"
                      className="accent-indigo-600 cursor-pointer h-4 w-4 rounded-md border-gray-300"
                      value={c}
                      checked={
                        clickedState === undefined
                          ? clickedPileCategory.category === c
                          : clickedState === c
                      }
                      onChange={(e) => handleChange(e)}
                    />
                    <span className="capitalize">{c}</span>
                  </label>
                </div>
              ))}
          </div>
        </div>
      </div>
      <CustomToast message={toast.message} show={toast.show} />
    </div>
  );
};

export default ChangeCategory;
