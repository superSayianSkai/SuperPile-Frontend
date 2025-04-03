const Header = () => {


  return (
    <div className="flex justify-between px-[1rem] h-[10vh] items-center  w-[100%] bg-white top-0 left-0 border-b-slate-200 border-x-0 border-[1px] z-[1000]">
      <div className="flex gap-[.7rem] py-[.8rem] font-Monsterrat font-bold text-[1rem]">
        {/* <img src={thunder} className="w-[30px] h-[30px]" /> */}
        <h1 className="text-[.8rem]">SUPERPILE</h1>
      </div>

      <i className="bi bi-search text-[.8rem]"></i>
    </div>
  );
};

export default Header;
