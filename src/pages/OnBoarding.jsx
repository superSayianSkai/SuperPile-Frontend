import piloDark from "../assets/Images/supapileCat2.png";
import piloLight from "../assets/Images/supapile.webp";
import useStateStore from "../zustard/useStateStore";
import { SupaPileAUTHContext } from "../context/SupaPileContext";
import { useState, useRef, useEffect } from "react";
import { InfoIcon, Crown } from "lucide-react";
import { useContext } from "react";
import { useTheme } from "../hooks/useTheme";
import { Link } from "react-router-dom";
import { useLocalPiles } from "../hooks/useLocalPiles";
import LocalPilesList from "../components/LocalPilesList";
import CustomToast from "../components/ShowCustomToast";
import SavingLoadingOverlay from "../components/SavingLoadingOverlay";

const OnBoarding = () => {
  const inputRef = useRef();
  const { setKeyword } = useStateStore();
  const { theme } = useTheme();
  const [active, setActive] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setIsLoading] = useState(false);
  const [showLocalSection, setShowLocalSection] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });
  const [isSavingLocally, setIsSavingLocally] = useState(false);
  const { handleSignIn } = useContext(SupaPileAUTHContext);
  
  const {
    localPiles,
    isLoading: localLoading,
    error: localError,
    addPile,
    removePile,
    refreshPiles,
    canAddMore,
    remainingSlots,
    pilesCount
  } = useLocalPiles();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    // Show local section if there are already saved piles
    if (pilesCount > 0) {
      setShowLocalSection(true);
    }
  }, [pilesCount]);

  const regex = /^https:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/;
  
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
  };

  const clearSearch = () => {
    setSearchValue("");
    setKeyword("");
  };

  const showCustomToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 3000);
  };

  const handleLocalSave = async () => {
    if (!regex.test(searchValue)) return;
    
    setIsSavingLocally(true);
    setIsLoading(true);
    
    try {
      await addPile(searchValue, 'general');
      setSearchValue("");
      setShowLocalSection(true);
      showCustomToast("Link saved! Fetching details...");
    } catch (error) {
      console.error('Error saving locally:', error);
      showCustomToast(error.message || "Failed to save link");
    } finally {
      setIsLoading(false);
      setIsSavingLocally(false);
    }
  };

  const handleSignUpAndSave = async () => {
    if (regex.test(searchValue)) {
      localStorage.setItem("pending_link", searchValue);
    }
    handleSignIn();
  };

  const handleRemoveLocalPile = (id) => {
    removePile(id);
    if (pilesCount <= 1) {
      setShowLocalSection(false);
    }
    showCustomToast("Link removed");
  };

  return (
    <>
      <div className="flex relative flex-col dark:bg-black justify-between min-h-[90svh] w-full overflow-hidden dark:text-white md:px-8">
        <div className="flex justify-center flex-col md:mt-8 items-center h-auto min-h-[68vh]">
          <div className="w-60 sm:w-52 md:w-64 h-53">
            <img
              src={theme === "dark" ? piloDark : piloLight}
              alt="Supapile Logo"
              width="240"
              height="212"
              loading="eager"
              style={{ objectFit: "contain" }}
            />
          </div>
          <div className="relative group -mt-[92px] w-full max-w-[560px] mx-auto">
            <div className="flex flex-col items-center text-black relative gap-[1.5rem] px-4">
              <div className="relative group w-full">
                {/* Search Input with conditional gradient border */}
                <div
                  className={`w-full rounded-2xl transition-all duration-300 ${
                    active
                      ? "bg-gradient-to-r p-[2px] from-[#ff66b2] to-[#ff8c00]"
                      : "border-2 border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setActive(true)}
                >
                  <div className="bg-white rounded-2xl overflow-hidden flex items-center gap-3">
                    <input
                      ref={inputRef}
                      value={searchValue}
                      onFocus={() => setActive(true)}
                      onBlur={() => setActive(false)}
                      placeholder="Paste a link here..."
                      onChange={handleSearch}
                      disabled={isSavingLocally}
                      className="flex-1 border-2 bg-transparent px-5 py-3 border-none outline-none text-gray-800 placeholder-gray-500 text-xs md:text-sm font-medium disabled:opacity-50"
                    />
                    {searchValue && !isSavingLocally && (
                      <i
                        onClick={clearSearch}
                        type="button"
                        className="bi bi-x-circle-fill cursor-pointer text-sm text-gray-400 pr-2 h-[20px] hover:text-gray-600 transition-colors duration-200"
                      ></i>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col mt-5 gap-2 justify-center items-center w-full">
                  <div className="">
                    <p className="text-gray-600 dark:text-white text-center w-[85%] mx-auto text-xs md:text-[.8rem] font-medium">
                      Organize, share, and manage your digital pile
                    </p>
                  </div>
                  
                  <div className="flex gap-3 mt-3 w-full max-w-md">
                    {/* Save Locally Button */}
                    {canAddMore && (
                      <button
                        onClick={handleLocalSave}
                        disabled={!regex.test(searchValue) || localLoading || isSavingLocally}
                        className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                          regex.test(searchValue) && !localLoading && !isSavingLocally
                            ? "bg-gray-600 text-white hover:bg-gray-700"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                        }`}
                      >
                        {isSavingLocally ? "Saving..." : `Save (${remainingSlots} left)`}
                      </button>
                    )}
                    
                    {/* Sign Up Button */}
                    <button
                      onClick={handleSignUpAndSave}
                      disabled={!regex.test(searchValue) || isSavingLocally}
                      className={`${canAddMore ? 'flex-1' : 'w-full'} rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                        regex.test(searchValue) && !isSavingLocally
                          ? "bg-gradient-to-r from-[#ff66b2] text-white to-[#ff8c00] animate-gradient-slide hover:opacity-80"
                          : "bg-black text-white dark:text-white dark:border-white dark:border-[1px] cursor-not-allowed opacity-50 pointer-events-none"
                      }`}
                    >
                      {loading ? "Saving...." : canAddMore ? "Sign Up & Save" : "Sign Up for Unlimited"}
                    </button>
                  </div>

                  {/* Error Message */}
                  {localError && !isSavingLocally && (
                    <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded-lg">
                      <p className="text-red-600 text-xs text-center">{localError}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Local Piles Section */}
          {(showLocalSection || pilesCount > 0) && (
            <div className="w-full  mx-auto mt-8 px-4">
              <div className=" rounded-2xl  border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      Your Piles
                    </h3>
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                      {pilesCount}/5
                    </span>
                  </div>
                  {!canAddMore && (
                    <div className="flex items-center gap-1 text-orange-500">
                      <Crown className="h-4 w-4" />
                      <span className="text-xs font-medium">Limit Reached</span>
                    </div>
                  )}
                </div>
                
                <LocalPilesList 
                  piles={localPiles} 
                  onRemove={handleRemoveLocalPile}
                  onRefresh={refreshPiles}
                  onShowToast={showCustomToast}
                />
                
                {/* Upgrade Message */}
                <div className="mt-10 p-4 rounded-lg border-gray-100 dark:border-gray-100/50 border-[1px] ">
                  <div className="flex items-center gap-2 mb-2">
                   
                    <h4 className="font-semibold text-gray-800 dark:text-white">
                      Get More Features
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    Sign up to save unlimited links aesthetically, sync across devices, organize with categories, and share your piles with others!
                  </p>
                  <button
                    onClick={handleSignIn}
                    disabled={isSavingLocally}
                    className="w-full bg-gradient-to-r from-[#ff66b2] to-[#ff8c00] text-white font-medium py-2 px-4 rounded-lg hover:opacity-90 transition-opacity text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sign Up Now - It&apos;s Free!
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <footer className="p-6 w-full  dark:bg-black bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="flex max-sm:flex-col max-sm:justify-center justify-between items-center text-center">
              <Link
                to="/updates"
                className="flex items-center justify-center gap-1 mb-2 hover:underline cursor-pointer hover:opacity-100 transition-opacity duration-200"
              >
                <InfoIcon className="h-4 w-4 sm:mt-1 " />
                <div className="font-bold text-[.8rem] sm:text-2xl bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
                  updates
                </div>
              </Link>
              <div className="text-gray-700 dark:text-gray-300 flex items-center gap-3 text-[.8rem] sm:text-sm md:text-base">
                all your URLS
                <span className="text-orange-500 text-2xl ">•</span>
                in one place
              </div>
            </div>
          </div>
        </footer>

        {/* Toast Notification */}
        <CustomToast show={toast.show} message={toast.message} />
      </div>

      {/* Saving Loading Overlay */}
      <SavingLoadingOverlay 
        isVisible={isSavingLocally} 
        message="Saving your link..."
      />
    </>
  );
};

export default OnBoarding;
