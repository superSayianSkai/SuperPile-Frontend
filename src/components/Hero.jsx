import { useMemo, useState, useRef } from "react";
import { useAuthStore } from "../zustard/useAuthStore";
import useStateStore from "../zustard/useStateStore";
import debounce from "../utilities/debounce";
import useOnClickOutside from "../hooks/useOnClickOutside";

const Hero = (allPiles = []) => {
  const { setKeyword } = useStateStore();
  const debounceIT = useMemo(() => debounce(setKeyword, 200), []);
  const name = useAuthStore().user?.data?.name;
  const newName = name?.split(" ")[0];
  const [active, setActive] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const searchContainerRef = useRef(null);

  // Use the existing hook to handle click outside
  useOnClickOutside(() => setActive(false), searchContainerRef, active);

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
          backdrop-filter: blur(10px);
       
        }
        
        .search-container:hover {
          {/* transform: translateY(-2px); */}
          {/* box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); */}
        }
        
        .search-container.active {
          background: linear-gradient(145deg, #ffffff, #f1f5f9);
          border: 2px solid #ff8c00;
          {/* box-shadow: 0 0 0 3px rgba(255, 140, 0, 0.2), 0 10px 25px rgba(0, 0, 0, 0.15); */}
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

      <div className="flex flex-col items-center text-black relative my-[2rem] gap-[0.6rem] md:gap-[1rem] px-2 md:px-4 mt-20">
        {/* Enhanced Title */}
        <div className="text-center">
          <h2 className="font-bold text-[1.5rem] sm:text-[1.8rem] md:text-[3rem] color">
            {newName ? `${newName}'s PileBoard` : "PileBoard"}
          </h2>
        </div>

        {/* Enhanced Search Container */}
        
        <div className="relative group">
          <div
            ref={searchContainerRef}
            onClick={() => setActive(true)}
            className={`search-container bg-gray-100 border-white rounded-full border-2  outline-none w-[300px] sm:w-[320px] md:w-[350px] pl-4 py-2 sm:px-5 sm:py-2.5 md:py-[.7rem] flex items-center gap-2 sm:gap-3 cursor-text transition-all duration-200 ${
              active ? "border-[#ff8c00] active" : "hover:border-gray-300"
            }`}
          >
            {/* Search Icon with Shake Animation */}
            <i
              className={`bi bi-search text-sm search-icon shake-animation ${
                active ? "active" : "text-gray-500"
              }`}
            ></i>
            
            <input
              value={searchValue}
              onFocus={() => setActive(true)}
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
      </div>
    </>
  );
};

export default Hero;
