import thunder from "../assets/thunder.png";
import { useState } from "react";
const Header = () => {
  const [active, setActive] = useState();

  return (
    <div className="flex justify-between px-[1rem] h-[5vh] items-center  w-[100%] bg-white top-0 left-0 border-b-slate-200 border-x-0 border-[1px] z-[1000]">
      <div className="flex gap-[.7rem] py-[.8rem] font-Monsterrat font-bold text-[1rem]">
        {/* <img src={thunder} className="w-[30px] h-[30px]" /> */}
        <h1 className="text-[.8rem]">SUPERPILE</h1>
      </div>
      <div
        onClick={() => setActive(true)}
        className={`rounded-sm w-[200px] py-1 h-[25px] flex items-center pl-[1rem] bg-gray-100  ${
          active ? "border-[2px] border-[#ff8c00]" : "border-none" 
        }`}
      >
        <i className="bi bi-search text-[.8rem]"></i>
        <input
          onFocus={() => setActive(true)}
          onBlur={() => setActive(false)}
          placeholder="Search your Linkboard "
          className="rounded-full h-[100%] w-[100%] text-black px-[1rem] bg-transparent border-transparent outline-none text-[12px]"
        />
      </div>
      {/* <i className="bi bi-search text-[.8rem]"></i> */}
    </div>
  );
};

export default Header;
