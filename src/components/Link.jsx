import { useContext } from "react";
import { SuperPileContext } from "../context/SuperPileContext";
const Link = () => {
  const { pile } = useContext(SuperPileContext);
  return (
    <div className="border-[1px] border-slate-300 w-[280px] pb-5 rounded-xl overflow-clip  ">
      <img src={pile.image}  />
      <div className="pt-[.8rem] px-[.7rem] flex flex-col gap-[5px] justify-between">
        <h2 className="font-bold text-[.9rem]">{pile.title}</h2>
        <p className="text-gray-500 text-[.7rem]">{pile.description}</p>
        <div className="flex justify-between items-center w-[100%] pr-[1rem]">
          <div className="flex gap-[.6rem] mt-[5px] items-center w-[100%]">
            <button className="w-[30%] rounded-full border-[1px] border-gray-500 hover:bg-gray-100  hover:border-orange-300 hover:text-black p-1 text-[.6rem]">
              Copy
            </button>
            <button className="w-[30%] rounded-full border-[1px] border-gray-500 hover:bg-gray-100  hover:border-orange-300 hover:text-black p-1 text-[.6rem]">
              Share
            </button>
          </div>
          <i className="bi bi-trash3 text-[20px] text-red-600 self-end cursor-pointer"></i>
        </div>
      </div>
    </div>
  );
};

export default Link;
