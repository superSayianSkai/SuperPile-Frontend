// import Link from "./Link";
import { useContext, useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { StateContext } from "../context/SupaPileContext";
import useFetchPile from "../tanstack-query-hooks/useFetchPile";
import useSoftDeletePile from "../tanstack-query-hooks/useSoftDeletePile";
import useMeta from "../tanstack-query-hooks/useMeta";
import ChangeCategoryContainer from "./ChangeCategoryContainer";
import CategoryController from "./CategoryController";
import { fetchCickedCategory } from "../tanstack-query-hooks/useFetchClickedCategory";
import { useMutation } from "@tanstack/react-query";
import useClickedModal from "../zustard/useClickedModal";
import useStateStore from "../zustard/useStateStore";
import { usePostStore } from "../zustard/usePostStore";
import useChangeVisibility from "../tanstack-query-hooks/useChangeVisibility";
import { getMetaDataSync } from "../utils/getMetaDataSync";
import CustomToast from "./ShowCustomToast";
import usePostPile from "../tanstack-query-hooks/usePostPile";
import { useQueryClient } from "@tanstack/react-query";
import PWAInstallNotification from "./PWAInstallNotification";
import pileBall from "../assets/supapile-icon2.svg";
import useAuth from "../tanstack-query-hooks/useAuthPile";
const PileBoard = () => {
  const { setLinkBoardPanelToggle, metaLink, hostName, hostNameSentence } =
    useContext(StateContext);
  const { supaPileState } = useStateStore();
  const { setPostData, pendingPosted } = usePostStore();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useFetchPile({
      category: supaPileState.category,
      keyword: supaPileState.keyword,
    });
  const allPiles = data?.pages.flatMap((page) => page.piles) || [];
  console.log("jessica loves me");
  console.log(allPiles);
  const queryClient = useQueryClient();
  console.log("selena chromez");
  const [showFirst, setShowFirst] = useState(true);
  // Add state to track image load errors
  const [imageErrors, setImageErrors] = useState(new Set());

  const { setTheModal, clicked } = useClickedModal();
  const { mutate: fetchMutate } = useMutation({
    mutationFn: fetchCickedCategory,
    onSuccess: (data) => {
      const modData = data.data[0];
      setTheModal({ pile: modData, isOpen: true, modalType: "changeCategory" });
    },
  });
  const { mutate: postMutate, error } = usePostPile({});
  console.log(error);
  if (
    error?.message ===
    "This link exists in your archived piles. Please restore it or use a different URL."
  ) {
    CustomToast("This pile exists in your archived piles.");
  }
  const { mutate: changeVisibility } = useChangeVisibility();

  let { data: MetaData } = useMeta({ link: metaLink });
  const { mutate } = useSoftDeletePile();

  const handleImageError = (linkId, imageUrl) => {
    console.log(`Image failed to load: ${imageUrl}`);
    setImageErrors((prev) => new Set([...prev, linkId]));
  };

  const softDelete = (e) => {
    mutate(e, {
      onSuccess: (res) => {
        const msg = res?.message || "Pile Archived";
        showCustomToast(msg);
      },
    });
  };

  const [toast, setToast] = useState({ show: false, message: "" });

  const showCustomToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 3000);
  };
 
  const { data: userData } = useAuth();
  console.log("your life will go down by half");
  console.log(userData.newTimer);
  const copy = (e) => {
    navigator.clipboard.writeText(e);
    showCustomToast("Copied to clipboard");
  };

  const handleClick = (pile) => {
    fetchMutate({ _id: pile });
  };

  const handleShortcut = (e) => {
    // For Mac (Cmd+K) and Windows/Linux (Ctrl+K)
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault(); // stops default browser search
      document.getElementById("my-button").click();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowFirst((prev) => !prev);
    }, 3000);
    return () => clearTimeout(interval);
  });

  const { ref: lastPileRef, inView } = useInView();
  const { ref: pileButtonRef, inView: isPileButtonInView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);
  const [fromLogin, setFromLogin] = useState("");
  const [fromLoginLoading, setFromLoginLoading] = useState(false);
  console.log(fromLogin);
  //  console.log("lets check this out")
  useEffect(() => {
    const savePendingLinkWithMeta = async () => {
      const pending = localStorage.getItem("pending_link");

      localStorage.removeItem("pending_link");
      // ✅ Skip if it's already been posted
      if (!pending || pendingPosted) return;

      setFromLoginLoading(true);
      const meta = await getMetaDataSync(pending);
      if (!meta) {
        setFromLoginLoading(false);
        return;
      }
      setFromLogin(meta);
      setFromLoginLoading(false);
      postMutate(
        { url: pending, category: "all" },
        {
          onSuccess: (data) => {
            // setFromLoginLoading(false); // removed as requested
            if (data?.message === "This link already exists in your pile.") {
              CustomToast("This link is already in your pile.");
              return;
            }

            setPostData(data); // ✅ This marks it as posted
            queryClient.setQueryData(["user"], (prev) => prev); // prevents stale-triggered refetch
            queryClient.invalidateQueries({ queryKey: ["pile"], exact: false });
          },
          onError: (error) => {
            // setFromLoginLoading(false); // removed as requested
            const msg = error?.response?.data?.message;
            console.log("API error message:", msg);

            if (msg === "This link already exists in your pile.") {
              CustomToast("This pile exist.");
            } else if (
              msg ===
              "This link exists in your archived piles. Please restore it or use a different URL."
            ) {
              if (error?.type === "archived_duplicate" && error?.message) {
                showCustomToast(error.message);
              }
            }
          },
        }
      );
    };
    savePendingLinkWithMeta();
  }, []);

  return (
    <div className="w-[100%] max-w-[90rem] mx-auto mt-[2rem]">
      <div className="flex-1 lg:mx-[30px] mx-[1rem] md:px-0 dark:bg-black min-h-[50vh] ">
        {clicked.isOpen && <ChangeCategoryContainer />}
        {!userData.data?.newTimer && <PWAInstallNotification />}
        <div className="flex justify-between mb-5 items-center md:px-2 border-b-[1px] border-slate-300 dark:border-slate-500 md:border-0">
          <CategoryController id={"pickCategory"} />
          <div className="flex justify-center items-center gap-5">
            <div ref={pileButtonRef}>
              <button
                id="my-button"
                onClick={setLinkBoardPanelToggle}
                className="group text-[.8rem] dark:bg-white dark:text-black md:text-[.7rem] flex justify-center items-center rounded-md text-white bg-black font-bold cursor-pointer hover:bg-gradient-to-r hover:from-[#ff66b2] hover:to-[#ff8c00] px-7 py-[.5rem] md:px-6 md:py-1 mb-2 relative h-6 overflow-hidden transition-colors"
              >
                <div
                  className={`absolute dark:text-black transition-opacity duration-500 ease-in-out ${
                    showFirst
                      ? "md:opacity-100 md:animate-fadeIn"
                      : "md:opacity-0 md:animate-fadeOut"
                  } text-white transition`}
                >
                  Add
                </div>

                <div
                  className={`max-sm:hidden absolute transition-opacity duration-500 ease-in-out ${
                    showFirst
                      ? "opacity-0 animate-fadeOut"
                      : "opacity-100 animate-fadeIn"
                  } flex items-center gap-1 text-[.7rem]`}
                >
                  <i className="bi bi-command"></i>
                  <i className="bi bi-plus"></i>
                  <p className="font-bold">K</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Show user-friendly message if no piles */}
        {isLoading && (
          <div className="w-full grid sm:grid-cols-2 lg:grid-cols-3 gap-x-[2rem] gap-y-[4rem] mt-8 max-w-[90rem] mx-auto">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="border-[1px] border-slate-300 rounded-xl overflow-clip animate-pulse flex flex-col gap-2"
              >
                <div className="w-full aspect-[16/9] bg-gray-300" />

                <div className="px-4 py-3 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-5/6" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}
        {allPiles.length === 0 && !fromLoginLoading || isLoading && (
          <div className="text-center text-gray-500 mt-20">
            You have no Pile. Catch and Pile your favorite links across the web.
          </div>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-[2rem] gap-y-[4rem] relative pb-[45px]">
          {(fromLoginLoading ||
            (fromLoginLoading &&
              !allPiles.some((pile) => pile.url === fromLogin.url))) && (
            <div className="">
              {Array.from({ length: 1 }).map((_, i) => (
                <div
                  key={i}
                  className="border-[1px] border-slate-300 dark:border-slate-500 rounded-xl overflow-clip animate-pulse flex flex-col gap-2"
                >
                  {/* Thumbnail skeleton */}
                  <div className="w-full aspect-[16/9] bg-gray-300" />

                  {/* Title and text */}
                  <div className="px-4 py-3 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-5/6" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          )}
          {allPiles?.map((link, index) => {
            const isLast = index === allPiles.length - 1;
            const hasImageError = imageErrors.has(link?._id);
            const imageUrl =
              link?.image ||
              (link?.url === MetaData?.url && MetaData?.image) ||
              fromLogin?.image;

            return (
              <div
                key={link?._id || MetaData?._id}
                data={allPiles}
                ref={isLast ? lastPileRef : null}
                className="w-full min-w-0 border-black "
              >
                <div
                  draggable="true"
                  className="border-[1px] border-slate-300 dark:border-slate-500 rounded-xl overflow-clip flex flex-col justify-between  cursor-pointer hover:opacity-90 "
                >
                  <a href={link?.url} target="_blank" className="">
                    <div className="w-full aspect-[16/9] bg-black">
                      {imageUrl && !hasImageError ? (
                        <img
                          src={imageUrl}
                          className="w-full h-full object-contain"
                          onError={() => handleImageError(link?._id, imageUrl)}
                          onLoad={() => {
                            // Remove from error set if image loads successfully after retry
                            setImageErrors((prev) => {
                              const newSet = new Set(prev);
                              newSet.delete(link?._id);
                              return newSet;
                            });
                          }}
                        />
                      ) : (
                        <div className="w-full h-full object-contain bg-black flex justify-center items-center font-bold transition-all duration-300 bg-gradient-to-r from-[#ff66b2] to-[#ff8c00]">
                          {link.title ? (
                            <h1 className="text-[.9rem] text-white text-center uppercase">
                              {link?.title || fromLogin?.title}
                            </h1>
                          ) : (
                            <h1 className="text-[.8rem] text-white dark:text-white uppercase ">
                              {hostName || fromLogin?.title}
                            </h1>
                          )}
                        </div>
                      )}
                    </div>
                  </a>
                </div>
                <div className="pt-[.8rem] px-[.7rem] flex flex-col gap-[5px] justify-between">
                  <h2 className="font-bold text-[.7rem]">
                    {link?.title ||
                      (link?.url === MetaData?.url && MetaData?.title) ||
                      fromLogin?.title ||
                      hostName}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-[.6rem] text-ellipsis mt-[10px]">
                    {link?.description?.slice(0, 152) ||
                      (link?.url === MetaData?.url &&
                        MetaData?.description?.slice(0, 152)) ||
                      fromLogin?.description?.slice(0, 152) ||
                      hostNameSentence}
                  </p>
                  <div className="flex items-center w-[100%] pr-[1rem]">
                    <div className="flex gap-4  mt-[10px] items-center w-[100%]">
                      <button
                        onClick={() => copy(link.url)}
                        className="p-1 rounded-md transition"
                      >
                        <i className="bi bi-clipboard hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#ff66b2] hover:to-[#ff8c00] transition"></i>
                      </button>
                      <button
                        onClick={() =>
                          setTheModal({
                            isOpen: true,
                            modalType: "share",
                            url: link.url,
                          })
                        }
                        className="p-1 rounded-md transition"
                      >
                        <i className="bi bi-share hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#ff66b2] hover:to-[#ff8c00] transition"></i>
                      </button>
                      <button className="p-1 rounded-md transition">
                        <i
                          onClick={async () => {
                            softDelete([
                              {
                                _id: link?._id,
                                category: link?.category,
                                keyword: "",
                              },
                            ]);
                            setFromLogin(undefined);
                          }}
                          className="bi bi-trash3 text-red-600 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#ff66b2] hover:to-[#ff8c00] transition cursor-pointer"
                        ></i>
                      </button>
                      <button
                        onClick={() => handleClick(link?._id)}
                        className="p-1 rounded-md transition relative"
                      >
                        <i className="bi bi-bookmark-check hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#ff66b2] hover:to-[#ff8c00] transition"></i>
                      </button>
                      <button className="p-1 rounded-md transition text-[15px]">
                        {console.log(link.visibility)}
                        {link?.visibility === true ? (
                          <i
                            onClick={() =>
                              changeVisibility(
                                {
                                  _id: link?._id,
                                  category: supaPileState?.category,
                                },
                                {
                                  onSuccess: (res) => {
                                    const apiMsg = res?.data;
                                    const friendlyMsg =
                                      apiMsg === "pile visible"
                                        ? "Pile is now visible"
                                        : apiMsg === "pile not visible"
                                        ? "Pile is now hidden"
                                        : apiMsg;

                                    showCustomToast(friendlyMsg);
                                  },
                                }
                              )
                            }
                            className="bi bi-eye hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#ff66b2] hover:to-[#ff8c00] transition"
                          ></i>
                        ) : (
                          <i
                            onClick={() =>
                              changeVisibility(
                                {
                                  _id: link?._id,
                                  category: supaPileState?.category,
                                },
                                {
                                  onSuccess: (res) => {
                                    const apiMsg = res?.data;
                                    const friendlyMsg =
                                      apiMsg === "pile visible"
                                        ? "Pile is now visible"
                                        : apiMsg === "pile not visible"
                                        ? "Pile is now hidden"
                                        : apiMsg;

                                    showCustomToast(friendlyMsg);
                                  },
                                }
                              )
                            }
                            className="bi bi-eye-slash hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#ff66b2] hover:to-[#ff8c00] transition"
                          ></i>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <CustomToast message={toast.message} show={toast.show} />
      {!isPileButtonInView && (
        <button
          onClick={setLinkBoardPanelToggle}
          className="fixed z-[999] bottom-6 right-6 xl:right-[calc((100vw-90rem)/2+1.5rem)] h-8 w-8 md:w-12 md:h-12 animate-fadeIn transition-all duration-500 ease-in-out transform hover:scale-105"
        >
          <img src={pileBall} className="w-[100 px] h-auto z-0" />
        </button>
      )}
    </div>
  );
};

export default PileBoard;
