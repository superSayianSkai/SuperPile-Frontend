// import Link from "./Link";
import { useContext } from "react";
import { StateContext } from "../context/SupaPileContext";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import useFetchPile from "../hooks/useFetchPile";
import useSoftDeletePile from "../hooks/useSoftDeletePile";
import useMeta from "../hooks/useMeta";
const PileBoard = () => {
  const { data } = useFetchPile({ id: "all" });
  const pile = data?.data?.data;
  const { setLinkBoardPanelToggle, metaLink, hostName, hostNameSentence } =
    useContext(StateContext);
  let { data: MetaData } = useMeta({ link: metaLink });
  const { mutate } = useSoftDeletePile();
  console.log(mutate);
  const softDelete = (e) => {
    console.log(e);
    mutate(e);
  };
  const copy = (e) => {
    console.log(e);
    navigator.clipboard.writeText(e);
    toast.success("copied to clipboard");
  };
  return (
    <div className="py-[20px] lg:mx-[50px] mx-[1rem] md:px-0">
      <div className="flex justify-between mb-[10px] items-center border-b-[1px] md:border-b-[0] pb-2  ">
        <div className="px-1 flex items-center gap-2 cursor-pointer hover:opacity-80">
          {/* <i className="bi bi-folder text-[1rem]"></i> */}
          <h2 className="font-bold text-[.9rem] md:text-[1rem] ">All</h2>
        </div>

        <button
          onClick={setLinkBoardPanelToggle}
          className="text-[.6rem] md:text-[.8rem] flex justify-center items-center rounded-md text-white font-bold cursor-pointer hover:opacity-100 bg-black px-6 py-2"
        >
          Pile
        </button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-[2rem] gap-y-[4rem]  md:p-2">
        {pile?.map((link) => {
          return (
            <div key={link._id || MetaData._id}>
              <div
                draggable="true"
                className="border-[1px] border-slate-300  rounded-xl overflow-clip flex flex-col justify-between cursor-pointer"
              >
                <a href={link.url} target="_blank" className="">
                  {/* metaData */}
                  <div className="w-full aspect-[16/9] bg-black">
                    {link.image || link.url === MetaData?.url ? (
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
                    <button className="text-[15px]">
                      <i className="bi bi-share hover:text-gray-500 "></i>
                    </button>
                    <button className=" rounded-full    text-[15px]">
                      <i
                        onClick={() => softDelete([{ _id: link._id }])}
                        className="bi bi-trash3 text-red-600 hover:text-gray-500   cursor-pointer"
                      ></i>
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
