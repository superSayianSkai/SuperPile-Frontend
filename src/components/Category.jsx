import { useContext, useRef, useState, useEffect } from "react";
import { StateContext } from "../context/SupaPileContext";
import { useFetchCategory } from "../tanstack-query-hooks/useFetchCategory";
// import useCategoryStore from "../zustard/useCategoryList";
import useStateStore from "../zustard/useStateStore";
const Category = () => {
  const { tick, setTheTick } = useContext(StateContext);
  const { setCategory } = useStateStore();

  const pressSomething = (e) => {
    setTheTick(e);
    setCategory(e);
  };
  const { data } = useFetchCategory();
  let category = data?.data.categories || [];

  const [showArrow, setShowArrow] = useState(false);
  const categoryRef = useRef();

  useEffect(() => {
    if (!categoryRef.current) return;
    const el = categoryRef.current;
    const handleScroll = () => {
      setShowArrow(el.scrollTop < 20); // adjust threshold as needed
    };
    el.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => el.removeEventListener("scroll", handleScroll);
  }, [categoryRef]);

  return (
    <div
      ref={categoryRef}
      className="border-2 bg-white text-black w-[200px] max-h-[130px] overflow-y-scroll scroll-smooth scroll overflow-hidden -left-2 z-[2] rounded-lg flex flex-col gap-2 absolute top-6 cursor-pointer"
    >
      {category
        ?.slice()
        .sort((a, b) => (a === "all" ? -1 : b === "all" ? 1 : 0))
        .map((c, index) => {
          return (
            <div
              onClick={() => pressSomething(c)}
              key={index}
              className="flex justify-between capitalize hover:bg-gray-200 px-3 py-2 hover:bg-transparent group"
            >
              <span>
                <h1 className="text-[.8rem] w-[100%] group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#ff66b2] group-hover:to-[#ff8c00]">
                  {c}
                </h1>
              </span>
              {tick === c && (
                <i className="bi bi-check2 text-[.8rem] group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#ff66b2] group-hover:to-[#ff8c00]"></i>
              )}
            </div>
          );
        })}
      {showArrow && (
        <div className="flex absolute right-2 bottom-2 justify-center">
           <i className="bi bi-chevron-double-down text-sm bouncing-arrow bi bi-arrow-down animate-bounce text-transparent bg-gradient-to-r from-[#ff66b2] to-[#ff8c00] bg-clip-text"></i>
        </div>
      )}
    </div>
  );
};

export default Category;
