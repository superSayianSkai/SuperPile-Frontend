import { useAuthStore } from "../zustard/useAuthStore";
import Profile from "./Profile";
import { Link } from "react-router";
import useOnClickOutside from "../hooks/useOnClickOutside";
import useCategoryStore from "../zustard/useCategoryStore";
import { useRef } from "react";
import useClickedModal from "../zustard/useClickedModal";
import { useTheme } from "../hooks/useTheme";
import { useLocation } from "react-router";
const Header = () => {
  const {pathname} = useLocation();
  const { setTheModal } = useClickedModal();
  const { closeModal, toggleCategory, modals } = useCategoryStore();
  const profileToggle = useRef();
  useOnClickOutside(closeModal, profileToggle, "profile");
  const { user: userData, isLoading } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  console.log(pathname)
  if (pathname === "/login") return null;

  return (
    <header className="sticky top-0 z-[1000] bg-white/80 dark:bg-black/60 backdrop-blur-md border-b border-gray-200/50 dark:border-slate-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center min-h-16 h-16 md:h-16 ">
          {/* Logo Section */}
          <Link
            to="/"
            className="group flex items-center gap-3 transition-all duration-300 hover:scale-105"
          >
            <div className="relative h-8 w-8 md:w-8 md:h-8">
              {/* Outer circle with gradient border */}
              <div
                className="absolute inset-0 rounded-full p-0.5"
                style={{
                  background: "linear-gradient(to right, #ff66b2, #ff8c00)",
                }}
              >
                <div className="w-full h-full rounded-full bg-white"></div>
              </div>

              {/* Top half - pink to orange gradient */}
              <div
                className="absolute top-0.5 left-0.5 right-0.5 h-[calc(50%-2px)] rounded-t-full"
                style={{
                  background: "linear-gradient(to right, #ff66b2, #ff8c00)",
                }}
              ></div>

              {/* Bottom half - clean white */}
              <div className="absolute bottom-0.5 left-0.5 right-0.5 h-[calc(50%-2px)] bg-white rounded-b-full"></div>

              {/* Center divider with subtle shadow */}
              <div className="absolute top-1/2 left-1 right-1 h-0.5 bg-gray-800 transform -translate-y-1/2 shadow-sm"></div>

              {/* Center diamond - more refined */}
              <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-white border-2 border-gray-800 rounded-sm transform -translate-x-1/2 -translate-y-1/2 rotate-45 shadow-sm"></div>

              {/* Center dot with subtle glow */}
              <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-gray-800 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>

            <div
              className="text-[.9rem] hidden md:block md:text-xl font-bold text-[#1f2937] dark:text-white transition-colors duration-300"
              // style={{ color: "var(--hover-color, #1f2937)" }}
            >
              <style>{`
                .group:hover span {
                  background: linear-gradient(to right, #ff66b2, #ff8c00);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  background-clip: text;
                }
              `}</style>
              Supapile
            </div>
          </Link>

          {/* User Section */}
          {userData ? (
            <div className="flex items-center justify-center px-4">
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                </div>
              ) : (
                <div className="flex items-center gap-4 h-9">
                  {theme === "light" ? (
                    <i
                      onClick={() => toggleTheme()}
                      className="h-9 flex items-center justify-center cursor-pointer bi bi-brightness-high hover:bg-gradient-to-r hover:from-[#ff66b2] hover:to-[#ff8c00] hover:bg-clip-text hover:text-transparent transition"
                    ></i>
                  ) : (
                    <i
                      onClick={() => toggleTheme()}
                      className="h-9 flex items-center justify-center cursor-pointer bi bi-moon hover:bg-gradient-to-r hover:from-[#ff66b2] hover:to-[#ff8c00] hover:bg-clip-text hover:text-transparent transition text-white"
                    ></i>
                  )}
                  {/* Share Button */}

                  <button
                    onClick={() =>
                      setTheModal({ isOpen: true, modalType: "generateLink" })
                    }
                    className="group h-9 dark:bg-black dark:border-white dark:text-white relative flex items-center gap-2 px-3 overflow-hidden text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-full hover:border-transparent hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                    style={{
                      "--hover-bg":
                        "linear-gradient(to right, #ff66b2, #ff8c00)",
                    }}
                  >
                    <style>{`
                      @keyframes arrowLoopUp {
                        0% {
                          transform: translateY(100%);
                          opacity: 0;
                        }
                        30% {
                          opacity: 1;
                        }
                        50% {
                          transform: translateY(0);
                          opacity: 1;
                        }
                        70% {
                          opacity: 0.5;
                        }
                        100% {
                          transform: translateY(-100%);
                          opacity: 0;
                        }
                      }
                      .group:hover .bouncing-arrow {
                        animation: arrowLoopUp 1s linear infinite;
                        background: linear-gradient(to right, #ff66b2, #ff8c00);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                        color: transparent;
                      }
                    `}</style>
                    <i className="bi bi-chevron-double-up text-sm bouncing-arrow"></i>
                    <span>Share</span>
                  </button>

                  {/* Profile Section */}
                  <div ref={profileToggle} className="relative">
                    <button
                      onClick={() => toggleCategory("profile")}
                      className="group relative"
                    >
                      <div className="relative">
                        {/* Outer gradient border container - only visible on hover */}
                        <div
                          className="absolute -inset-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            background:
                              "linear-gradient(to right, #ff66b2, #ff8c00)",
                          }}
                        ></div>

                        {/* Profile picture container */}
                        <div className="relative w-9 h-9 rounded-full overflow-hidden bg-white">
                          <img
                            src={userData?.data?.profilePicture}
                            alt="Profile"
                            className="w-full h-full object-cover transition-all duration-300 shadow-sm group-hover:shadow-md"
                          />
                        </div>
                      </div>
                    </button>

                    {/* Profile Dropdown */}
                    {modals.profile && (
                      <div className="absolute right-0 top-full mt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        <Profile />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {/* <button className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors duration-200">
                Sign in
              </button> */}
              <Link
                to="/login"
                className=" relative px-4 py-3 sm:px-6 sm:py-2 text-xs sm:text-sm font-semibold text-white rounded-full transition-all duration-300 shadow-sm hover:shadow-lg transform hover:scale-105 hover:opacity-80"
                style={{
                  background: "linear-gradient(to right, #ff66b2, #ff8c00)",
                }}
              >
                <span className="relative z-10 ">Get started</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
