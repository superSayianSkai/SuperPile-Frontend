import useFetchArchivedPile from "../tanstack-query-hooks/useFetchArchivedPile.js";
import useHardDeletePile from "../tanstack-query-hooks/useHardDeletePile.js";
import useRestorePile from "../tanstack-query-hooks/useRestorePile.js";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import CustomToast from "../components/ShowCustomToast.jsx";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../zustard/useAuthStore.js";
const ArchivedPage = () => {
  const navigate = useNavigate();
  const {
    user: userData,
    // isLoading: theRealIsLoading,
    // isError: theRealIsError,
  } = useAuthStore();
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
    isError,
  } = useFetchArchivedPile();
  const { mutate } = useHardDeletePile();
  const { mutate: fetchMutate } = useRestorePile();
  console.log(data);
  const pile = data?.pages.flatMap((page) => page.piles) || [];
  const { ref, inView } = useInView();

  const [toast, setToast] = useState({ show: false, message: "" });
  console.log("antartica");
  console.log(isError);
  console.log(error);
  const showCustomToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 3000);
  };

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const hardDelete = (e) => {
    console.log(e);
    mutate(e);
    showCustomToast("Link deleted permanently.");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showCustomToast("Link copied to clipboard!");
  };

  if (!userData) {
    navigate("/onBoarding");
  }

  return (
    <div className="min-h-[100svh] dark:bg-black dark:text-white">
      <div className="flex justify-center">
        <h2 className="text-[2.3rem] font-bold pt-[2rem] color">Archived</h2>
      </div>
      <div className=" py-[20px] lg:mx-[30px] mx-[1rem] md:px-0 ">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-[2rem] gap-y-[4rem]  relative py-[70px]">
          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="border-[1px] border-slate-300  dark:border-slate-500 rounded-xl overflow-clip animate-pulse flex flex-col gap-2"
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
          {error && Array.isArray(pile) && pile.length === 0 && (
            <div className="text-center text-gray-500 col-span-full">
              No archived links found.
            </div>
          )}
          {pile
            ?.slice()
            .reverse()
            .map((link) => {
              return (
                <div key={link._id}>
                  <div
                    draggable="true"
                    className="border-[1px] border-slate-300  rounded-xl overflow-clip flex flex-col justify-between cursor-pointer hover:opacity-90 "
                  >
                    <a href={link.url} target="_blank" className="">
                      <div className="w-full aspect-[16/9] bg-black">
                        {link.image != "" ? (
                          <img
                            src={link.image}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="w-full h-full object-contain bg-black flex justify-center items-center font-bold bg-gradient-to-r from-[#ff66b2] to-[#ff8c00] ">
                            <h1 className="text-[.9rem] text-white uppercase">
                              {link.title}
                            </h1>
                          </div>
                        )}
                      </div>
                    </a>
                  </div>
                  <div className="pt-[.8rem] px-[.7rem] flex flex-col gap-[5px] justify-between">
                    <h2 className="font-bold text-[.7rem]">{link.title}</h2>
                    <p className="text-gray-500 text-[.6rem] text-ellipsis mt-[10px]">
                      {link?.description}
                    </p>
                    <div className="flex items-center w-[100%] pr-[1rem]">
                      <div className="flex gap-4  mt-[10px] items-center w-[100%]">
                        {/* onClick={() => copy(link.url)} */}
                        <button
                          className="text-[15px]"
                          onClick={() => copyToClipboard(link.url)}
                        >
                          <i className="bi bi-clipboard hover:text-gray-500 "></i>
                        </button>

                        <button className="rounded-full  text-[15px]">
                          <i
                            onClick={() => hardDelete({ _id: link._id })}
                            className="bi bi-trash3 text-red-600 hover:text-gray-500   cursor-pointer"
                          ></i>
                        </button>
                        {console.log(link.category)}
                        <button
                          onClick={() => {
                            fetchMutate({
                              _id: link._id,
                              category: link.category ?? "uncategorized",
                            });
                            showCustomToast("Link restored.");
                          }}
                          className="relative rounded-full text-[15px]"
                        >
                          <i className="bi bi-arrow-repeat hover:text-gray-500"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          <div ref={ref} className="text-center col-span-full py-4">
            {isFetchingNextPage ? (
              <p className="text-gray-400 text-sm">Loading more...</p>
            ) : !hasNextPage && pile === undefined ? (
              <p className="text-gray-400 text-sm">No more links</p>
            ) : null}
          </div>
        </div>
      </div>
      <CustomToast message={toast.message} show={toast.show} />
    </div>
  );
};

export default ArchivedPage;
