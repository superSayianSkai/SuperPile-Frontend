import { useContext } from "react";
import { SuperPileContext } from "../context/SuperPileContext";
const LinkPanel = () => {
  const { setLinkBoardPanelToggle } = useContext(SuperPileContext);

  return (
    <div className="fixed inset-0 z-[1000] flex justify-center items-center">
      <div className="absolute inset-0 bg-black opacity-70"></div>
      <div className="relative bg-white w-[30%] h-[350px]   rounded-md z-[1001]  flex flex-col gap-[20px] px-[20px] py-[20px]">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-[1.2rem]">Add to your Pile</h2>
          <i
            onClick={setLinkBoardPanelToggle}
            className="cursor-pointer bi bi-x text-[1.8rem] opacity-[60%] hover:opacity-100"
          ></i>
        </div>
        <form className="flex flex-col  ">
          <div className="flex flex-col gap-[1rem]">
            <input
              placeholder="Title"
              className="border-[1px] border-slate-300 rounded-md shadow-sm px-[1rem] h-[50px] active:border-slate-400"
            />
            <input
              placeholder="Description"
              className="border-[1px] border-slate-300 rounded-md shadow-sm px-[1rem] h-[50px] active:border-slate-400"
            />
            <input
              placeholder="paste your Link"
              className="border-[1px] border-slate-300 rounded-md shadow-sm px-[1rem] h-[50px] active:border-slate-400"
            />
          </div>
          <div className="bg-black h-[60px] w-[100%] mt-[20px] absolute bottom-0 left-0 right-0 flex justify-center items-center">
            <button className="bg-black w-[50%] text-white text-[.8rem] p-[1rem] border-none h-[100%]">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LinkPanel;
