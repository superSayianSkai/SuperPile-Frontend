// import Link from "./Link";
import { useContext } from "react";
import { SuperPileContext } from "../context/SuperPileContext";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
const LinkBoard = () => {
  const { setLinkBoardPanelToggle } = useContext(SuperPileContext);
  const { pile, removePile } = useContext(SuperPileContext);
  const copy = (e) => {
    navigator.clipboard.writeText(e.target.value);
    toast.success("copied to clipboard");
    console.log("copied to clipboard");
  };
  return (
    <div className="mt-[100px] mx-[20px] md:mx-[50px] ">
      <h2 className="font-bold text-[1.8rem] md:text-[3rem] mb-[2rem] color">
        Skai's Linkboard
      </h2>
      <div className="flex justify-between mb-[10px] items-center">
        <div className="px-1 flex items-center gap-2">
          <i className="bi bi-folder text-[1rem]"></i>
          <h2 className="font-bold text-[.9rem] md:text-[1rem] ">Categories</h2>
          {/* <p className="text-[12px] text-gray-500 leading-[2.5]">
            All your links neatly gathered in one convenient place for quick and
            easy access whenever you need them.
          </p> */}
        </div>

        <button className="text-[.6rem] md:text-[.8rem] flex justify-center items-center rounded-md text-white font-bold cursor-pointer hover:opacity-100 bg-black px-6 py-2">
          <h2 onClick={setLinkBoardPanelToggle} className="">
            Pile
          </h2>
        </button>
      </div>
      <div className="flex gap-x-[1.9rem]  gap-y-[3rem] py-[1.5rem] w-[100%]  flex-wrap">
        {pile?.map((link) => {
          return (
            <div
              draggable="true"
              key={link.id}
              className="border-[1px] border-slate-300 md:w-[219px] pb-2 rounded-xl overflow-clip flex flex-col justify-between cursor-pointer "
            >
              <a href={link.link} target="_blank" className="">
                <div className="w-[100%]  h-[100%] ">
                  <img
                    style={{ objectPosition: "center 20%" }}
                    src={link.image}
                    className="w-[100%] h-[120px] object-cover block "
                  />
                </div>
              </a>
              <div className="pt-[.8rem] px-[.7rem] flex flex-col gap-[5px] justify-between">
                <h2 className="font-bold text-[.7rem]">{link.title}</h2>
                <p className="text-gray-500 text-[.6rem] text-ellipsis mt-[10px]">
                  {link.description.slice(0, 152)}
                </p>
                <div className="flex items-center w-[100%] pr-[1rem]">
                  <div className="flex gap-2  mt-[10px] items-center w-[100%]">
                    <button
                      value={link.link}
                      onClick={copy}
                      className="text-[15px]"
                    >
                      <i className="bi bi-clipboard hover:text-gray-500 "></i>
                    </button>
                    {/* <button className="w-[30%] rounded-full border-[1px] border-gray-500 hover:bg-gray-100  hover:border-orange-300 hover:text-black p-1 text-[.6rem]">
                      Share
                    </button> */}
                    <button className=" rounded-full    text-[15px]">
                      <i
                        onClick={() => removePile(link)}
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

export default LinkBoard;
