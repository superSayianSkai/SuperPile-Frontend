// import Link from "./Link";
import { useContext, useState } from "react";
import { StateContext } from "../context/SupaPileContext";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import useFetchPile from "../tanstack-query-hooks/useFetchPile";
import useSoftDeletePile from "../tanstack-query-hooks/useSoftDeletePile";
import useMeta from "../tanstack-query-hooks/useMeta";
import ChangeCategoryContainer from "./ChangeCategoryContainer";
import CategoryController from "./CategoryController";
import { fetchCickedCategory } from "../tanstack-query-hooks/useFetchClickedCategory";
import { useMutation } from "@tanstack/react-query";
import useClickedModal from "../zustard/useClickedModal";
import { useEffect } from "react";
import useStateStore from "../zustard/useStateStore";
import useChangeVisibility from "../tanstack-query-hooks/useChangeVisibility";
import { useFetchCategory } from "../tanstack-query-hooks/useFetchCategory";

const PileBoard = () => {
  const { setLinkBoardPanelToggle, metaLink, hostName, hostNameSentence } =
    useContext(StateContext);
  const { supaPileState } = useStateStore();
  // const { piles: data } = useFetchPile({
  //   category: supaPileState.category,
  //   keyword: supaPileState.keyword,
  // });
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useFetchPile({
    category: supaPileState.category,
    keyword: supaPileState.keyword,
  });
  const allPiles = data?.pages.flatMap((page) => page.piles) || [];

  console.log("i love Jesus");
  console.log();
  console.log("heh eheyeheyheye");
  console.log(data);

  const [showFirst, setShowFirst] = useState(true);
  const { setTheModal, clicked } = useClickedModal();
  const { mutate: fetchMutate } = useMutation({
    mutationFn: fetchCickedCategory,
    onSuccess: (data) => {
      const modData = data.data[0];
      setTheModal({ pile: modData, isOpen: true, modalType: "changeCategory" });
    },
  });

  const { mutate: changeVisibility } = useChangeVisibility();
  const { data: category } = useFetchCategory();
  console.log("hey hey hey");
  console.log(category);
  const link = allPiles.map((pile) => pile?.visibility);

  console.log("hey hey hey");
  console.log(link);
  let { data: MetaData } = useMeta({ link: metaLink });
  const { mutate } = useSoftDeletePile();
  const softDelete = (e) => {
    mutate(e);
  };
  const copy = (e) => {
    navigator.clipboard.writeText(e);
    toast.success("copied to clipboard");
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
  return (
    <div className=" lg:mx-[30px] mx-[1rem] md:px-0 ">
      {clicked.isOpen && <ChangeCategoryContainer />}
      <div className="flex justify-between mb-5 items-center md:px-2 border-b-2 md:border-0">
        <CategoryController id={"pickCategory"} />
        <div className="flex justify-center items-center gap-5">
          <button
            id="my-button"
            onClick={setLinkBoardPanelToggle}
            className="text-[.6rem] md:text-[.8rem] flex justify-center items-center rounded-md text-white bg-black font-bold cursor-pointer hover:opacity-100 px-6 py-1 mb-2 relative h-6 overflow-hidden"
          >
            <div
              className={`absolute transition-opacity duration-500 ease-in-out ${
                showFirst
                  ? "opacity-100 animate-fadeIn"
                  : "opacity-0 animate-fadeOut"
              }`}
            >
              Pile
            </div>

            <div
              className={`absolute transition-opacity duration-500 ease-in-out ${
                showFirst
                  ? "opacity-0 animate-fadeOut"
                  : "opacity-100 animate-fadeIn"
              } flex items-center gap-1 text-[.8rem]`}
            >
              <i className="bi bi-command"></i>
              <i className="bi bi-plus"></i>
              <p className="font-bold">K</p>
            </div>
          </button>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-[2rem] gap-y-[4rem]  relative pb-[45px]">
        {allPiles?.map((link) => {
          return (
            <div key={link?._id || MetaData?._id} data={allPiles}>
              <div
                draggable="true"
                className="border-[1px] border-slate-300  rounded-xl overflow-clip flex flex-col justify-between cursor-pointer hover:opacity-90 "
              >
                <a href={link?.url} target="_blank" className="">
                  <div className="w-full aspect-[16/9] bg-black">
                    {link?.image != "" ||
                    (link?.url === MetaData?.url &&
                      MetaData.image?.length > 0) ? (
                      <img
                        src={link?.image || MetaData?.image}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full object-contain bg-black flex justify-center items-center font-bold ">
                        {link.title ? (
                          <h1 className="text-[2rem] text-white uppercase">
                            {link?.title}
                          </h1>
                        ) : (
                          <h1 className="text-[2rem] text-white uppercase ">
                            {hostName}
                          </h1>
                        )}
                      </div>
                    )}
                  </div>
                </a>
              </div>
              <div className="pt-[.8rem] px-[.7rem] flex flex-col gap-[5px] justify-between">
                <h2 className="font-bold text-[.7rem]">
                  {link?.title || MetaData
                    ? link?.title || MetaData?.title
                    : hostName}
                </h2>
                <p className="text-gray-500 text-[.6rem] text-ellipsis mt-[10px]">
                  {link?.description || MetaData?.description
                    ? link?.description?.slice(0, 152) ||
                      MetaData?.description?.slice(0, 152)
                    : hostNameSentence}
                </p>
                <div className="flex items-center w-[100%] pr-[1rem]">
                  <div className="flex gap-4  mt-[10px] items-center w-[100%]">
                    <button
                      onClick={() => copy(link.url)}
                      className="text-[15px]"
                    >
                      <i className="bi bi-clipboard hover:text-gray-500 "></i>
                    </button>
                    <button
                      onClick={() =>
                        setTheModal({ isOpen: true, modalType: "share" })
                      }
                      className="text-[15px]"
                    >
                      <i className="bi bi-share hover:text-gray-500 "></i>
                    </button>
                    <button className=" rounded-full  text-[15px]">
                      <i
                        onClick={() =>
                          softDelete([
                            { _id: link?._id, category: link?.category },
                          ])
                        }
                        className="bi bi-trash3 text-red-600 hover:text-gray-500   cursor-pointer"
                      ></i>
                    </button>
                    <button
                      onClick={() => handleClick(link?._id)}
                      className="relative rounded-full text-[15px]"
                    >
                      <i className="bi bi-bookmark-check hover:text-gray-500"></i>
                    </button>
                    <button className="text-[15px]">
                      {link?.visibility === true ? (
                        <i
                          onClick={() =>
                            changeVisibility({
                              _id: link?._id,
                              data: supaPileState?.category,
                            })
                          }
                          className="bi bi-eye hover:text-gray-500 "
                        ></i>
                      ) : (
                        <i
                          onClick={() =>
                            changeVisibility({
                              _id: link?._id,
                              data: supaPileState?.category,
                            })
                          }
                          className="bi bi-eye-slash hover:text-gray-500 "
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
      {hasNextPage && (
        <div className="flex items-center justify-center">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className= "text-white text-sm px-4 py-2 mb-4 rounded-md border border-black bg-black disabled:opacity-50"
          >
            {isFetchingNextPage ? "Loading more..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default PileBoard;
