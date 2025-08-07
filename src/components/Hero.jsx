import { useMemo, useState } from "react";
import { useAuthStore } from "../zustard/useAuthStore";
import useStateStore from "../zustard/useStateStore";
import debounce from "../utilities/debounce";

const Hero = () => {
  const { setKeyword } = useStateStore();
  const debounceIT = useMemo(() => debounce(setKeyword, 200), []);
  const name = useAuthStore().user?.data?.name;
  const newName = name?.split(" ")[0];
  const [active, setActive] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    debounceIT(value);
  };

  const clearSearch = () => {
    setSearchValue("");
    setKeyword("");
  };

  return (
    <>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255, 140, 0, 0.4); }
          50% { box-shadow: 0 0 0 8px rgba(255, 140, 0, 0); }
        }
        
        .shake-animation {
          animation: shake 0.6s ease-in-out;
        }
        
        .pulse-glow {
          animation: pulse-glow 2s infinite;
        }
        
        .search-container {
          background: linear-gradient(145deg, #f8fafc, #e2e8f0);
          backdrop-filter: blur(10px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .search-container:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .search-container.active {
          background: linear-gradient(145deg, #ffffff, #f1f5f9);
          box-shadow: 0 0 0 3px rgba(255, 140, 0, 0.2), 0 10px 25px rgba(0, 0, 0, 0.15);
        }
        
        .title-gradient {
          background: linear-gradient(135deg, #1a202c, #2d3748, #ff8c00);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .search-icon {
          transition: all 0.3s ease;
        }
        
        .search-icon.active {
          color: #ff8c00;
          transform: scale(1.1);
        }
      `}</style>

      <div className="flex flex-col items-center text-black relative my-[2rem] gap-[0.6rem] md:gap-[1.5rem] px-2 md:px-4 mt-20">
        {/* Enhanced Title */}
        <div className="text-center">
          <h2 className="font-bold text-[1.5rem] sm:text-[1.8rem] md:text-[3rem] color">
            {newName? `${newName}'s PileBoard` : "PileBoard" }
          </h2>
        </div>

        {/* Enhanced Search Container */}
        <div className="relative group">
          <div
            onClick={() => setActive(true)}
            className={`search-container rounded-full border-2 w-[280px] sm:w-[320px] md:w-[400px] px-4 py-2 sm:px-5 sm:py-2.5 md:py-3 flex items-center gap-2 sm:gap-3 cursor-text transition-all duration-300 ${
              active
                ? "border-[#ff8c00] active pulse-glow"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            {/* Search Icon with Shake Animation */}
            <i
              className={`bi bi-search text-sm search-icon shake-animation ${
                active ? "active" : "text-gray-500"
              }`}
            ></i>

            {/* Search Input */}
            <input
              value={searchValue}
              onFocus={() => setActive(true)}
              onBlur={() => setActive(false)}
              placeholder="Search your pileboard..."
              onChange={handleSearch}
              className="flex-1 bg-transparent border-none outline-none text-[.7rem] sm:text-[.75rem] md:text-[.85rem] text-gray-800 placeholder-gray-500 font-medium"
            />

            {/* Clear Button */}
            {searchValue && (
              <i
                onClick={clearSearch}
                type="button"
                className="bi bi-x-circle-fill cursor-pointer text-sm text-gray-400 md:h-[20px] hover:text-gray-600 transition-colors duration-200"
              ></i>
            )}
          </div>


        </div>

        {/* Search Stats or Quick Actions */}
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 md:gap-4 text-[.55rem] sm:text-[.65rem] md:text-[.8rem] text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <i className="bi bi-lightning-charge text-[#ff8c00] text-xs"></i>
            <span>Quick search</span>
          </div>
          <div className="flex items-center gap-1.5">
           <i className="bi bi-bookmark text-[#ff8c00] text-xs"></i>
            <span>Save pile</span>
          </div>
          <div className="flex items-center gap-1.5">
            <i className="bi bi-share text-[#ff8c00] text-xs"></i>
            <span>Share piles</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
