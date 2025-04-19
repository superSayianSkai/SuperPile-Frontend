// import Link from "./Link";
import { useContext } from "react";
import { StateContext } from "../context/SupaPileContext";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import useFetchPile from "../hooks/useFetchPile";
import useSoftDeletePile from "../hooks/useSoftDeletePile";
import useMeta from "../hooks/useMeta";
import CategoryController from "./CategoryController";
import Category from "./Category";
const PileBoard = () => {
  const { setLinkBoardPanelToggle, metaLink, hostName, hostNameSentence,tick} =
    useContext(StateContext);
  const { data } = useFetchPile({ id: tick });
  const pile = data?.data?.data;
  let { data: MetaData } = useMeta({ link: metaLink });
  const { mutate } = useSoftDeletePile();
  console.log(hostName)
  console.log(MetaData)
  const softDelete = (e) => {
    console.log(e);
    mutate(e);
  };
  const copy = (e) => {
    console.log(e);
    navigator.clipboard.writeText(e);
    toast.success("copied to clipboard");
  };

  // i have to check what is going on in this function 
  const shareNavigator = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title: "Check this out!", url });
        return;
      } catch (error) {
        console.error("Sharing failed", error);
      }
    }

    // Fallback: open WhatsApp Web with prefilled message
    const encodedURL = encodeURIComponent(url);
    const whatsappURL = `https://web.whatsapp.com/send?text=${encodedURL}`;
    window.open(whatsappURL, "_blank");

    // Optionally also copy to clipboard
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    } catch (error) {
      console.error("Clipboard copy failed:", error);
      alert("Could not copy link. Please copy manually.");
    }
  };

  return (
    <div className="py-[20px] lg:mx-[30px] mx-[1rem] md:px-0 ">

      <div className="flex justify-between mb-5 items-center md:px-2 border-b-2 md:border-0">
       <CategoryController/>
        <button
          onClick={setLinkBoardPanelToggle}
          className="text-[.6rem] md:text-[.8rem] flex justify-center items-center rounded-md text-white font-bold cursor-pointer hover:opacity-100 bg-black px-5 py-1 mb-2"
        >
          Pile
        </button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-[2rem] gap-y-[4rem]  relative pb-[45px]">
      <Category/>
        {pile?.map((link) => {
          return (
            <div key={link._id || MetaData._id}>
              <div
                draggable="true"
                className="border-[1px] border-slate-300  rounded-xl overflow-clip flex flex-col justify-between cursor-pointer hover:opacity-90"
              >
                <a href={link.url} target="_blank" className="">
                  {/* metaData */}
                  <div className="w-full aspect-[16/9] bg-black">
                  {console.log(MetaData?.image?.length)}
                    {link.image!="" || link.url === MetaData?.url && MetaData.image?.length > 0? (
                      <img
                        src={link.image || MetaData?.image}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full object-contain bg-black flex justify-center items-center font-bold">
                        {link.title ? (
                          <h1 className="text-[2rem] text-white uppercase">
                            {link.title}
                          </h1>
                        ) : (
                          <h1 className="text-[2rem] text-white uppercase">
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
                  {link.title || MetaData
                    ? link.title || MetaData?.title
                    : hostName}
                </h2>
                <p className="text-gray-500 text-[.6rem] text-ellipsis mt-[10px]">
                  {link.description || MetaData
                    ? link.description.slice(0, 152) ||
                      MetaData?.description.slice(0, 152)
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
                        shareNavigator({
                          title: "whatsapp",
                          text: link.url,
                          url: "https://web.whatsapp.com/",
                        })
                      }
                      className="text-[15px]"
                    >
                      <i className="bi bi-share hover:text-gray-500 "></i>
                    </button>
                    <button className=" rounded-full    text-[15px]">
                      <i
                        onClick={() => softDelete([{ _id: link._id }])}
                        className="bi bi-trash3 text-red-600 hover:text-gray-500   cursor-pointer"
                      ></i>
                      
                    </button>
                    <button className=" rounded-full    text-[15px]"> 
                      <i className="bi bi-bookmark-check hover:text-gray-500 "></i>
                      </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PileBoard;
