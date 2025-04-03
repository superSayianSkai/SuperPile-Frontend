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
    <div className="py-[20px] md:mx-[50px] ">
      <div className="flex justify-between mb-[10px] items-center border-b-[1px] md:border-b-[0] pb-2  ">
        <div className="px-1 flex items-center gap-2 cursor-pointer hover:opacity-80">
          {/* <i className="bi bi-folder text-[1rem]"></i> */}
          <h2 className="font-bold text-[.9rem] md:text-[1rem] hidden md:block ">
            All
          </h2>
        </div>

        <button
          onClick={setLinkBoardPanelToggle}
          className="text-[.6rem] md:text-[.8rem] flex justify-center items-center rounded-md text-white font-bold cursor-pointer hover:opacity-100 bg-black px-6 py-2"
        >
          Pile
        </button>
      </div>
      <div className="grid grid-cols-3 gap-x-[2rem] gap-y-[4rem] p-2">
        {pile?.map((link) => {
          return (
            <div key={link.id}>
              <div
                draggable="true"
                className="border-[1px] border-slate-300  rounded-xl overflow-clip flex flex-col justify-between cursor-pointer"
              >
                <a href={link.link} target="_blank" className="">
                  <div className="w-full aspect-[16/9] bg-black">
                    <img
                      src={link.image}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </a>
              </div>
              <div className="pt-[.8rem] px-[.7rem] flex flex-col gap-[5px] justify-between">
                <h2 className="font-bold text-[.7rem]">{link.title}</h2>
                <p className="text-gray-500 text-[.6rem] text-ellipsis mt-[10px]">
                  {link.description.slice(0, 152)}
                </p>
                <div className="flex items-center w-[100%] pr-[1rem]">
                  <div className="flex gap-4  mt-[10px] items-center w-[100%]">
                    <button
                      value={link.link}
                      onClick={copy}
                      className="text-[15px]"
                    >
                      <i className="bi bi-clipboard hover:text-gray-500 "></i>
                    </button>
                    <button className="text-[15px]">
                    <i className="bi bi-share hover:text-gray-500 "></i>
                    </button>
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
