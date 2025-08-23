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
      // Show arrow when there's more content below (scrollable content)
      const hasScrollableContent = el.scrollHeight > el.clientHeight;
      const isNotAtBottom = el.scrollTop < (el.scrollHeight - el.clientHeight - 20);
      setShowArrow(hasScrollableContent && isNotAtBottom);
    };
    el.addEventListener('scroll', handleScroll);
    // Also check on resize or content change
    const resizeObserver = new ResizeObserver(handleScroll);
    resizeObserver.observe(el);
    handleScroll(); // Initial check
    return () => {
      el.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
    };
  }, [category]); // Add category as dependency to recheck when categories change
  console.log("formula 1");
  console.log(category.length);
  return (
    <div
      ref={categoryRef}
      className={`border-[1px] dark:border-gray-700 bg-[#F4F4F4] dark:bg-[#191919] text-black ${
        category.length > 3 && "w-[200px] max-w-[200px] sm:w-[300px] sm:max-w-[300px]"
      } flex-wrap max-h-[155px] items-center overflow-y-scroll scroll-smooth scroll overflow-hidden -left-2 z-[2] rounded-2xl flex  gap-2 absolute top-6 cursor-pointer p-3 shadow-2xl"
  `}
    >
      {category
        ?.slice()
        .sort((a, b) => (a === "all" ? -1 : b === "all" ? 1 : 0))
        .map((c, index) => {
          return (
            <div
              onClick={() => pressSomething(c)}
              key={index}
              className={`flex justify-between ${
                tick === c &&
                "bg-gradient-to-r from-[#ff66b2] to-[#ff8c00] text-white "
              }  hover:bg-gradient-to-r hover:from-[#ff66b2] hover:to-[#ff8c00] hover:text-white bg-[#E3E3E3] font-medium text-black rounded-md capitalize  px-2 py-1 `}
            >
              <span>
                <h1 className="text-[.8rem] lowercase w-[100%">{c}</h1>
              </span>
              {tick === c && <i className="bi bi-check2 text-[.8rem] "></i>}
            </div>
          );
        })}
      {showArrow && (
        <div className="flex absolute right-2 bottom-2 justify-center">
          <i className="bi bi-chevron-double-down text-sm dark:text-white bouncing-arrow bi bi-arrow-down animate-bounce "></i>
        </div>
      )}
    </div>
  );
};

export default Category;
