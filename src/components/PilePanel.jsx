import CustomToast from "./ShowCustomToast";
import { useContext, useRef, useState, useEffect } from "react";
import { StateContext } from "../context/SupaPileContext";
import useMeta from "../tanstack-query-hooks/useMeta";
import usePostPile from "../tanstack-query-hooks/usePostPile";
import { useFetchCategory } from "../tanstack-query-hooks/useFetchCategory";
import useStateStore from "../zustard/useStateStore";
import useFetchPile from "../tanstack-query-hooks/useFetchPile";
const PilePanel = () => {
  useEffect(() => {
    console.log("hey there  ");
  });
  const { supaPileState } = useStateStore();
  const { data: pileData, refetch } = useFetchPile({
    category: supaPileState.category,
    keyword: supaPileState.keyword,
  });
  const regex = /^https:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/;
  const textAreaRef = useRef();
  const secondTextAreaRef = useRef();
  const [isVisible, setIsVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const triggerToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setHasError(true);
    setTimeout(() => {
      setShowToast(false);
      setHasError(false);
    }, 3000);
  };

  const {
    setLinkBoardPanelToggle,
    modifyTheHostName,
    metaLink,
    hostNameSentence,
    setTheMetaLink,
  } = useContext(StateContext);
  const [meta, showMeta] = useState(false);
  const [categoryInput, setCategoryInput] = useState("all");
  const { data, isLoading } = useMeta({ link: metaLink });
  const { mutate, error } = usePostPile();
  const allPiles = pileData?.pages.flatMap((page) => page.piles) || [];
  const pileUrls = allPiles.map((pile) => pile.url);
  const isDuplicate = pileUrls.includes(metaLink);
  console.log("Jesus is Lord");
  console.log(isDuplicate);
  const categoryData = useFetchCategory();
  const categoryList = categoryData?.data?.data?.categories ?? [];
  console.log("hshshshshshs");
  console.log(categoryList);

  console.log("hey hey hey ayotide");
  console.log(categoryList);
  const titleMaxLength = 30;
  const descMaxLength = 104;

  // Trigger entrance animation
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // useEffect(() => {
  //   document.body.style.overflow = "hidden";
  //   return () => {
  //     document.body.style.overflow = "";
  //   };
  // }, []);
  useEffect(() => {
    // Prevent body scroll when modal is open
    document.documentElement.style.overflow = "hidden";
    document.body.scroll = "no";

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.documentElement.style.overflow = "auto";
      document.body.scroll = "yes";
    };
  }, []);

  const theCategoryInput = (e) => {
    const value = e.target.value;
    setCategoryInput(value.toLowerCase());
  };

  const workOnSetTheMetaLink = (e) => {
    const input = e.target.value;
    if (input.match(regex)) {
      showMeta(true);
      setTheMetaLink(input);
      modifyTheHostName(input);
      console.log(regex.test(input));
      setSearchValue(input);
    } else {
      setSearchValue("");
      showMeta(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (hasError) return;
    if (isDuplicate) {
      triggerToast("This pile exist.");
      return;
    }
    console.log("why why");
    // 👇 Then trigger the mutation
    mutate({
      url: metaLink,
      category: categoryInput,
      keyword: supaPileState.keyword ?? "",
    });
    setLinkBoardPanelToggle();
    setTimeout(() => {
      refetch();
      console.log("kyle");
      console.log(error);
    }, [3000]);
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      setLinkBoardPanelToggle();
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-[1000]  flex justify-center items-center transition-all duration-150 ease-in-out">
      <div
        onClick={handleClose}
        className="absolute bg-black bg-opacity-60  inset-0 backdrop-blur-sm z-10"
      ></div>

      <div
        className={` z-[100] md:max-w-2xl max-w-full rounded-3xl  scroll md:w-[100%] absolute  md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2 ${
          meta
            ? " w-[100%]  md:min-h-[70svh]  max-md:inset-0 max-md:top-[80px] "
            : "w-[95%] min-h-[50svh] md:min-h-[70svh] "
        } `}
      >
        <div
          className={`bg-white border scroll border-gray-200 overflow-y-auto  ${
            meta
              ? "w-[100%]  max-md:pb-20 max-md:min-h-[100svh] max-md:max-h-[100svh] rounded-3xl md:w-[100%]"
              : "rounded-3xl w-[100%]"
          } shadow-2xl   max-w-full absolute  z-20 flex flex-col transform transition-all duration-250 ease-out ${
            isVisible
              ? "translate-y-0 scale-100 opacity-100"
              : "translate-y-8 scale-95 opacity-0"
          }`}
        >
          {/* Modal Header */}
          <div className="px-6 sticky inset-0 top-0 h-[65px] z-[100] py-4 border-b  border-gray-200 flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100">
            <h2 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
              Add Pile
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-600 hover:text-gray-800 hover:opacity-50 transition-all duration-150 hover:scale-110 p-1 rounded-full hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Input Section */}
          <div className="px-6 py-5 bg-gray-50">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
            >
              <div className="flex-1 relative group w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-pink-500 group-focus-within:text-orange-500 transition-colors duration-150"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  onChange={workOnSetTheMetaLink}
                  placeholder="Paste your link here..."
                  className="w-full pl-10 pr-4 py-3 bg-white text-gray-800 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-transparent transition-all duration-150 placeholder-gray-500"
                />
              </div>
              <button
                disabled={!regex.test(searchValue)}
                type="submit"
                className={`w-full sm:w-auto group relative flex ${
                  !regex.test(searchValue) &&
                  "bg-black text-white hidden dark:text-white dark:border-white dark:border-[1px] cursor-not-allowed opacity-50 pointer-events-none"
                } items-center justify-center p-4 md:p-3 bg-black text-white font-medium rounded-xl transition-all duration-150 hover:bg-gradient-to-r hover:from-[#ff66b2] hover:to-[#ff8c00] hover:scale-105 hover:shadow-lg overflow-hidden`}
                aria-label="Submit link"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-150"></div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white relative z-10 group-hover:translate-x-0.5 transition-transform duration-150"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </form>
          </div>

          {meta && (
            <div
              className={`pb-6 bg-white transform transition-all duration-250 delay-100 ${
                meta ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              <div className="mx-6 bg-gray-50 rounded-2xl p-5 border border-gray-200 transition-all duration-150">
                {isLoading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-full md:w-40 h-32 bg-gradient-to-br from-gray-300 to-gray-200 rounded-xl"></div>
                      <div className="flex-1 space-y-3">
                        <div className="h-5 bg-gradient-to-r from-gray-300 to-gray-200 rounded w-3/4"></div>
                        <div className="space-y-2">
                          <div className="h-3 bg-gradient-to-r from-gray-300 to-gray-200 rounded"></div>
                          <div className="h-3 bg-gradient-to-r from-gray-300 to-gray-200 rounded w-5/6"></div>
                          <div className="h-3 bg-gradient-to-r from-gray-300 to-gray-200 rounded w-4/6"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col md:flex-row gap-5">
                      {data.image?.length > 1 ? (
                        <img
                          src={data.image}
                          alt="Preview"
                          className="w-full md:w-48 h-40 object-cover rounded-xl border border-gray-300 shadow-lg"
                        />
                      ) : (
                        <div className="w-full md:w-48 h-40 rounded-xl flex items-center justify-center bg-gradient-to-br from-pink-100 to-orange-100 border border-gray-300">
                          <div className="text-center p-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-10 w-10 mx-auto text-pink-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <p className="text-gray-600 mt-2 text-sm font-medium">
                              No preview available
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="flex-1 overflow-hidden">
                        <h2
                          ref={textAreaRef}
                          className="font-bold text-xl text-gray-800 mb-2 line-clamp-2"
                          maxLength={titleMaxLength}
                        >
                          {data.title}
                        </h2>
                        <p
                          ref={secondTextAreaRef}
                          maxLength={descMaxLength}
                          className="text-gray-600 text-sm line-clamp-4"
                        >
                          {data.description
                            ? data.description
                            : hostNameSentence}
                        </p>
                        <div className="mt-3 flex items-center text-sm text-gray-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1 text-pink-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                            />
                          </svg>
                          <span className="truncate">{hostNameSentence}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Category Section */}
              <div className="px-6  mt-5 ">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="relative flex-1 group">
                    <input
                      value={categoryInput}
                      onChange={theCategoryInput}
                      className="w-full px-4 py-3 bg-white text-gray-800 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-transparent transition-all duration-150 placeholder-gray-500"
                      maxLength={20}
                      placeholder="Enter category name"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 text-sm">
                      {20 - categoryInput.length}
                    </div>
                  </div>
                  <button
                    onClick={handleSubmit}
                    className="group relative px-6 py-3 bg-black text-white font-medium rounded-xl transition-all duration-150 flex items-center justify-center gap-2 hover:bg-gradient-to-r hover:from-[#ff66b2] hover:to-[#ff8c00] hover:scale-105 hover:shadow-lg overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-150"></div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 relative z-10"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="relative z-10  group-hover:text-white">
                      Add to Collection
                    </p>
                  </button>
                </div>
              </div>

              {/* Category Suggestions */}
              <div className="pl-6 mt-4 sm:mt-3 ">
                <p className="text-xs text-gray-500 mb-2">categories:</p>
                <div className="flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-thin p-2 scroll border-black">
                  {categoryList.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryInput(cat.toLowerCase())}
                      className={`px-3 py-1.5 text-sm rounded-full transition-all duration-150 hover:scale-105 ${
                        categoryInput === cat.toLowerCase()
                          ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg"
                          : "bg-[#F4F4F4] text-black border border-gray-300 hover:bg-gradient-to-r hover:from-[#ff66b2] hover:to-[#ff8c00] hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Custom styles for animations */}
      <style>{`
        @keyframes bounce-up {
          0% {
            transform: translateY(100px) scale(0.9);
            opacity: 0;
          }
          50% {
            transform: translateY(-10px) scale(1.02);
            opacity: 0.8;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
        
        .animate-bounce-up {
          animation: bounce-up 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
      `}</style>
      <CustomToast message={toastMessage} show={showToast} />
    </div>
  );
};

export default PilePanel;
