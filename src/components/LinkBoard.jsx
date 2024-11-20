import Link from "./Link";
import { useContext } from "react";
import { SuperPileContext } from "../context/SuperPileContext";
const LinkBoard = () => {
  const { setLinkBoardPanelToggle } = useContext(SuperPileContext);
  return (
    <div className="min-h-[100vh] mt-[80px] mx-[50px]">
      <div className="flex justify-between mb-[10px]">
        <div>
          <h2 className="font-bold text-[1rem] ">Your Linkboard</h2>
          <p className="text-[12px] text-gray-500 leading-[2.5]">
            All your links neatly gathered in one convenient place for quick and
            easy access whenever you need them.
          </p>
        </div>

        <i
          onClick={setLinkBoardPanelToggle}
          className="bi bi-plus-circle text-[1.2rem] cursor-pointer opacity-[60%] hover:opacity-100 "
        ></i>
      </div>
      <div className="flex flex-wrap gap-y-[5rem] justify-between py-[1rem]">
        <Link />
        <Link />
        <Link />
        <Link />
      </div>
    </div>
  );
};

export default LinkBoard;
