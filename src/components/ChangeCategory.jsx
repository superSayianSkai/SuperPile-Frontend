import { useFetchCategory } from "../tanstack-query-hooks/useFetchCategory.js";
import useCategoryChanger from "../zustard/useCategoryChanger.js";
import { useRef, useState } from "react";
import useClickedModal from "../zustard/useClickedModal.js";
import useChangeCategory from "../tanstack-query-hooks/useChangeCategory.js";
const ChangeCategory = () => {
  const { data } = useFetchCategory();
  const { setTheCategoryChangerStore } = useCategoryChanger();
  const { clicked } = useClickedModal();
  const [clickedState, setClickedState] = useState();
  const category = data?.data.categories;

  const { mutate } = useChangeCategory();
  let clickedPileCategory = clicked.pile;
  console.log();
  const handleChange = async (e) => {
    console.log(e);
    const ticked = e.target.value;
    console.log("hey brother");
    console.log(ticked);
    setTheCategoryChangerStore(ticked);
    mutate({
      _id: clickedPileCategory._id,
      category: ticked, // ✅ new category
      fromCategory: clicked.pile.category,
    });

    setClickedState(ticked);
  };

  const checkedInput = useRef();

  return (
    <div className="bg-white w-[260px] max-h-[280px] rounded-xl shadow-md p-4 flex flex-col z-[2000]">
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
              className="flex items-center justify-between px-2 py-2 rounded-md hover:bg-gray-100 transition"
            >
              <label className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer w-[100%]">
                <input
                  ref={checkedInput}
                  type="checkbox"
                  className="accent-indigo-600 h-4 w-4 rounded-md border-gray-300"
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
  );
};

export default ChangeCategory;
