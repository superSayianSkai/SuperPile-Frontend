import { useState } from "react";
const Title = () => {
  const [active, setActive] = useState();
  return (
    <div className="flex flex-col items-center  text-black  relative my-[6rem] gap-[.8rem]">
      <h2 className="font-bold text-[1.8rem] md:text-[3rem] color">
        Skai&apos;s PileBoard
      </h2>
  {/* i need to make this animated */}
      <div
        onClick={() => setActive(true)}
        className={`rounded-2xl  w-[300px] px-4 py-2 flex items-center  bg-gray-100  ${
          active ? "border-[2px] border-[#ff8c00]" : "border-none"
        }`}
      >
        <i className="bi bi-search text-[.8rem]"></i>
        <input
          onFocus={() => setActive(true)}
          onBlur={() => setActive(false)}
          placeholder="Search your Linkboard "
          className="rounded-full h-[100%] w-[100%] px-2 text-black bg-transparent border-transparent outline-none text-[12px]"
        />
      </div>
    </div>
  );
};

export default Title;
