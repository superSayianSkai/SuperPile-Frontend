import piloDark from "../assets/Images/supapileCat2.png";
import piloLight from "../assets/Images/supapile.webp";
import useStateStore from "../zustard/useStateStore";
import { SupaPileAUTHContext } from "../context/SupaPileContext";
import { useState } from "react";
import { InfoIcon } from "lucide-react";
import { useContext } from "react";
import { useTheme } from "../hooks/useTheme";
import { Link } from "react-router-dom"; // Add this import for navigation
const OnBoarding = () => {
  const { setKeyword } = useStateStore();
  const { theme } = useTheme();
  console.log(theme);
  const [active, setActive] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setIsLoading] = useState(false);
  const { handleSignIn } = useContext(SupaPileAUTHContext);

  const regex = /^https:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/;
  const handleSearch = (e) => {
    const value = e.target.value;
    console.log(value);
    console.log(regex.test(value));
    setSearchValue(value);
  };

  const clearSearch = () => {
    setSearchValue("");
    setKeyword("");
  };

  const handleLinkSubmit = async (link) => {
    setIsLoading(true);
    localStorage.setItem("pending_link", link);
    handleSignIn();
  };

  return (
    <div className="flex relative flex-col dark:bg-black justify-between min-h-[90svh] max-h-[100svh] w-full overflow-hidden dark:text-white md:px-8">
      <div className="flex justify-center flex-col md:mt-8 items-center h-[68vh]">
        <div className="w-60 sm:w-52 md:w-64 h-53">
          <img  src={theme === "dark" ? piloDark : piloLight} />
        </div>
        <div className="relative group -mt-[92px] w-full  max-w-[560px] mx-auto">
          <div className="flex flex-col items-center text-black relative  gap-[1.5rem] px-4">
            <div className="relative group w-full">
              {/* Search Input with conditional gradient border */}
              <div
                className={`w-full rounded-2xl transition-all duration-300 ${
                  active
                    ? "bg-gradient-to-r p-[2px] from-[#ff66b2] to-[#ff8c00]"
                    : "border-2  border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setActive(true)}
              >
                <div className="bg-white rounded-2xl overflow-hidden flex items-center gap-3">
                  <input
                    value={searchValue}
                    onFocus={() => setActive(true)}
                    onBlur={() => setActive(false)}
                    placeholder="Paste a link here..."
                    onChange={handleSearch}
                    className="flex-1 border-2 bg-transparent px-5 py-3  border-none outline-none text-gray-800 placeholder-gray-500 text-xs md:text-sm font-medium"
                  />
                  {searchValue && (
                    <i
                      onClick={clearSearch}
                      type="button"
                      className="bi bi-x-circle-fill cursor-pointer text-sm text-gray-400  pr-2 h-[20px]  hover:text-gray-600 transition-colors duration-200"
                    ></i>
                  )}
                </div>
              </div>
              {/* Save Link Button */}
              <div className="flex flex-col mt-5 gap-2 justify-center items-center w-full">
                <div className="">
                  <p className="text-gray-600 dark:text-white text-center w-[85%] mx-auto text-xs md:text-[.8rem] font-medium">
                    Organize, share, and manage your digital pile
                  </p>
                </div>
                <button
                  onClick={() => handleLinkSubmit(searchValue)}
                  disabled={!regex.test(searchValue)}
                  className={`mt-3 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    regex.test(searchValue)
                      ? "bg-gradient-to-r from-[#ff66b2] text-white to-[#ff8c00] animate-gradient-slide hover:opacity-80"
                      : "bg-black text-white dark:text-white dark:border-white dark:border-[1px] cursor-not-allowed opacity-50 pointer-events-none"
                  }`}
                >
                  {loading ? "Saving...." : "Save Link"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="p-6 w-full  max-sm:absolute max-sm:inset-x-0 max-sm:bottom-2 dark:bg-black bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex max-sm:flex-col max-sm:justify-center justify-between items-center text-center">
            <Link 
              to="/updates" 
              className="flex items-center justify-center gap-1 mb-2 hover:underline cursor-pointer hover:opacity-80 transition-opacity duration-200"
            >
              <InfoIcon className="h-4 w-4 sm:mt-1" />
              <div className="font-bold text-[.8rem] sm:text-2xl bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
                updates
              </div>
            </Link>
            <div className="text-gray-700 dark:text-gray-300 flex items-center gap-3 text-[.8rem] sm:text-sm md:text-base">
              all your URLS
              <span className="text-orange-500 text-2xl animate-pulse">•</span>
              in one place
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OnBoarding;
