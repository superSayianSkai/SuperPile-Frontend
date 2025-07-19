import { useMemo, useState } from "react";
import useAuth from "../tanstack-query-hooks/useAuthPile";
import useStateStore from "../zustard/useStateStore";
import debounce from "../utilities/debounce";

const Hero = () => {
  const { setKeyword } = useStateStore();
  const debounceIT = useMemo(() => debounce(setKeyword, 200), []);
  const name = useAuth().data?.data?.name;
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
      {/* Custom CSS for shake animation */}
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

      <div className="flex flex-col items-center text-black relative my-[4rem] gap-[1.5rem] px-4">
        {/* Enhanced Title */}
        <div className="text-center">
          <h2 className="font-bold text-[1.8rem] md:text-[3rem] color">
            {newName}&apos;s PileBoard
          </h2>
          <p className="text-gray-600 text-xs md:text-sm mt-2 font-medium">
            Organize, share, and manage your digital pile
          </p>
        </div>

        {/* Enhanced Search Container */}
        <div className="relative group">
          <div
            onClick={() => setActive(true)}
            className={`search-container rounded-2xl border-2 w-[320px] md:w-[400px] px-5 py-3 flex items-center gap-3 cursor-text transition-all duration-300 ${
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
              className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-500 text-xs md:text-sm font-medium"
            />

            {/* Clear Button */}
            {searchValue && (
              <i
                onClick={clearSearch}
                type="button"
                className="bi bi-x-circle-fill cursor-pointer text-sm text-gray-400 h-[20px] hover:text-gray-600 transition-colors duration-200"
              ></i>
            )}
          </div>


        </div>

        {/* Search Stats or Quick Actions */}
        <div className="flex items-center gap-4 text-xs text-gray-600">
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
