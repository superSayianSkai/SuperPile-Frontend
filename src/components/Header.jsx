import useAuth from "../tanstack-query-hooks/useAuthPile";
import profile from "../assets/Images/profile.svg";
import Profile from "./Profile";
import { Link } from "react-router";
import useOnClickOutside from "../hooks/useOnClickOutside";
import useCategoryStore from "../zustard/useCategoryStore";
import { useRef } from "react";
const Header = () => {
  const {closeModal ,toggleCategory, modals}=useCategoryStore()
  const profileToggle=useRef();
  
  useOnClickOutside(closeModal,profileToggle, "profile")
  const { data, isLoading } = useAuth();
  return (
    <div className="flex justify-between px-[1rem] h-[10vh] items-center  w-[100%] bg-white top-0 left-0 border-b-slate-200 border-x-0 border-[1px] z-[1000]">
      <Link to="/" className="flex gap-[.7rem] py-[.8rem] font-Monsterrat font-bold text-[1rem] items-center">
        {/* <img src={thunder} className="w-[30px] h-[30px]" /> */}
        <div className={`relative`} style={{ width: "28px", height: "28px" }}>
          {/* Outer circle */}
          <div className="absolute inset-0 rounded-full border-2 border-black"></div>

          {/* Top half - orange */}
          <div
            className="absolute top-0 left-0 right-0 h-1/2 rounded-t-full"
            style={{ backgroundColor: "#ff8c00" }}
          ></div>

          {/* Bottom half - white */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white rounded-b-full"></div>

          {/* Center band */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-black transform -translate-y-1/2"></div>

          {/* Center button - diamond shape */}
          <div className="absolute top-1/2 left-1/2 w-2.5 h-2.5 bg-white border border-black rounded-sm transform -translate-x-1/2 -translate-y-1/2 rotate-45"></div>

          {/* Small dot in center */}
          <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-black rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>

          {/* Decorative elements - small triangles */}
          <div className="absolute top-1/4 right-1/4 w-0.5 h-0.5 transform rotate-45 bg-black"></div>
          <div
            className="absolute bottom-1/4 left-1/4 w-0.5 h-0.5 transform rotate-45"
            style={{ backgroundColor: "#ff8c00" }}
          ></div>
        </div>
        <div className="text-[.9rem]">Supapile</div>
      </Link>
      {data ? (
        <div className="flex">
          {isLoading ? (
            <img src={profile} />
          ) : (
            <div className="flex items-center gap-[2rem] justify-center">
            <div className="font-bold border-[1px] border-gray-400 py-[.4rem] px-[.8rem]  rounded-full text-[.8rem] cursor-pointer flex gap-2 hover:opacity-90 justify-center items-center"> 
            <i className="bi bi-chevron-double-up"></i>
            <p>Share</p>
            </div>            
            <div  ref={profileToggle}>
            <img
              onClick={()=>toggleCategory("profile")}
              src={data?.data?.profilePicture}
              className="rounded-full h-auto w-[32px] cursor-pointer relative"
            />
          { modals.profile && <Profile/>}
            </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex gap-2">
          <button className="text-[.8rem] font-bold border-[1px] py-1 px-4 rounded-md  hover:bg-slate-100">
            Sign in
          </button>
          <button className="text-[.8rem] font-bold border-[1px] py-1 px-4 rounded-md  hover:opacity-75 bg-black text-white">
            Sign Up
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
