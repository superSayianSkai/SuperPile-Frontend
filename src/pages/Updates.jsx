import pokiemon from "../assets/Images/pokiemon.gif";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";

const Updates = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };
  
  const handleImageLoaded = () => {
    setImageLoaded(true);
  };

  // Add this useEffect to handle cached images
  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = pokiemon;
    
    // If image is already complete (cached), set loaded immediately
    if (img.complete) {
      setImageLoaded(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-4 sm:py-8 relative">
      {/* Back Navigation - positioned at page edge on desktop */}

      <div className="sm:absolute sm:left-4 sm:top-8 sm:z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-0 mb-4 sm:mb-0">
          <button
            onClick={handleGoBack}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>
      </div>

      <article className="max-w-4xl mx-auto overflow-hidden px-4 sm:px-6 lg:px-8">
        {!imageLoaded ? (
          <div className="animate-pulse mt-10 space-y-4">
            <div className="flex flex-col  gap-6">
              <div className="flex-1 space-y-3">
                <div className="flex gap-10 items-center ">
                  <div className="bg-gradient-to-r from-gray-300 to-gray-200 rounded w-20 h-8 "></div>
                  <div className=" bg-gradient-to-r from-gray-300 to-gray-200 rounded w-48 h-4"></div>
                </div>

                <div className="space-y-2">
                  <div className="h-3 bg-gradient-to-r from-gray-300 to-gray-200 rounded w-4/6"></div>
                  <div className="h-3 bg-gradient-to-r from-gray-300 to-gray-200 rounded w-5/6"></div>
                  <div className="h-3 bg-gradient-to-r from-gray-300 to-gray-200 rounded"></div>
                </div>

                <div className="max-w-4xl h-64 sm:h-80 mt-just  md:h-96 lg:h-[500px] bg-gradient-to-br from-gray-300 to-gray-200 rounded-xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-60 animate-shimmer"></div>
                </div>

                <div className=" flex flex-col gap-20 ">
                  <div className="space-y-2">
                    <div className="h-3 bg-gradient-to-r from-gray-300 to-gray-200 rounded w-5/6"></div>
                    <div className="h-3 bg-gradient-to-r from-gray-300 to-gray-200 rounded"></div>
                    <div className="bg-gradient-to-r from-gray-300 to-gray-200 rounded  h-[50px]"></div>
                  </div>

                  <div className="space-y-2">
                    <div className="h-3 bg-gradient-to-r from-gray-300 to-gray-200 rounded w-5/6"></div>
                    <div className="h-3 bg-gradient-to-r from-gray-300 to-gray-200 rounded"></div>
                    <div className="bg-gradient-to-r from-gray-300 to-gray-200 rounded h-[50px]"></div>
                  </div>

                  <div className="space-y-2">
                    <div className="h-3 bg-gradient-to-r from-gray-300 to-gray-200 rounded w-5/6"></div>
                    <div className="h-3 bg-gradient-to-r from-gray-300 to-gray-200 rounded"></div>
                    <div className="bg-gradient-to-r from-gray-300 to-gray-200 rounded h-[50px]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <header className="py-4 sm:py-6">
              <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                <div className="bg-black hidden dark:block dark:bg-white rounded-lg px-3 sm:px-4 py-2 shadow-md">
                  <div className="text-center">
                    <div className="text-sm sm:text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">
                      1.0
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r block dark:hidden from-pink-500 to-orange-500 rounded-lg px-3 sm:px-4 py-2 shadow-md">
                  <div className="text-center">
                    <div className="text-sm sm:text-base font-bold text-white dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-pink-500 dark:to-orange-500">
                      1.0
                    </div>
                  </div>
                </div>

                <div className="px-3 sm:px-4 py-2">
                  <div className="text-center">
                    <time
                      className="text-sm sm:text-base font-semibold text-gray-800 dark:text-white"
                      dateTime="2024-01-15"
                    >
                      January 15, 2025
                    </time>
                  </div>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl dark:text-white font-bold text-gray-900 mb-4 leading-tight">
                Supapile, here we go!
              </h1>
            </header>

            {/* Article Content */}
            <div className="py-1">
              {/* Featured Image - now responsive */}
              <figure className="mb-6 sm:mb-8">
                <div className="w-full max-w-4xl h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden mx-auto rounded-lg ">
                  <img
                    src={pokiemon}
                    className="w-full h-full object-cover"
                    onLoad={handleImageLoaded}
                    alt="SupaPile Pokemon themed illustration"
                  />
                </div>
                <figcaption className="text-center mt-4 sm:mt-6 text-gray-400 dark:text-gray-400 italic text-sm sm:text-base">
                  Save, Share & Pile your links
                </figcaption>
              </figure>

              {/* Article Body */}
              <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
                <div className="space-y-4 sm:space-y-6 dark:text-white text-gray-700 leading-relaxed">
                  <div className="text-sm sm:text-base dark:text-white space-y-3 sm:space-y-4">
                    <p>
                      I love to curate websites, especially the ones I find
                      useful or can learn from. For the longest time, I'd just
                      dump them into my WhatsApp "me" chat for later… but over
                      time, it became a chaotic mess.
                    </p>

                    <p>
                      I tried switching to bookmarks, but honestly, it was
                      worse, I'd forget about them completely, and the whole
                      setup just didn't work for me.
                    </p>

                    <p>
                      At work, people often asked if I had good resources to
                      share. Most times, I'd be scrolling endlessly through my
                      messy WhatsApp chat just to find one link.
                    </p>

                    <p>
                      Then one day, a colleague told me she hated how her own
                      links on WhatsApp were scattered and clunky. Another
                      colleague said the same thing not long after.
                    </p>

                    <p className="font-semibold">
                      That's when I decided to build SupaPile, a place to store
                      links beautifully and share them effortlessly.
                    </p>
                  </div>

                  <h3 className="text-xl sm:text-2xl dark:text-white font-semibold text-gray-800 mt-6 sm:mt-8 mb-3 sm:mb-4">
                    Features
                  </h3>

                  <ul className="space-y-2 sm:space-y-3 ml-4 sm:ml-6">
                    <li className="flex items-start">
                      <span className="text-black dark:text-white mr-2 flex-shrink-0">
                        •
                      </span>
                      <span className="text-sm sm:text-base">
                        Save and categorize your favorite links faster than
                        lightning.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-black dark:text-white mr-2 flex-shrink-0">
                        •
                      </span>
                      <span className="text-sm sm:text-base">
                        Share links on your Pileboard with friends
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-black dark:text-white mr-2 flex-shrink-0">
                        •
                      </span>
                      <span className="text-sm sm:text-base">
                        Use the Supapile extension to save links from any site
                        instantly—no need to open SupaPile
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-black dark:text-white mr-2 flex-shrink-0">
                        •
                      </span>
                      <span className="text-sm sm:text-base">
                        Add SupaPile to your device like an app so you can open
                        it instantly
                      </span>
                    </li>
                  </ul>

                  <h3 className="text-xl sm:text-2xl dark:text-white font-semibold text-gray-800 mt-6 sm:mt-8 mb-3 sm:mb-4">
                    Design Philosophy
                  </h3>

                  <div className="text-sm sm:text-base dark:text-white space-y-3 sm:space-y-4">
                    <p>
                      I'll be honest with you - the SupaPile icon and concept
                      draws heavy inspiration from Pokémon. You know how
                      trainers collect, organize, and share their Pokémon? Well,
                      that's exactly what I wanted SupaPile to do for your
                      favorite links. The Pokeball-inspired design reflects this
                      "gotta catch 'em all" mentality, but for web resources! I
                      thought it was a fun way to make link management feel more
                      like an adventure.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-gray-700 max-w-4xl mx-auto dark:text-gray-300 mt-6 sm:mt-8 text-sm sm:text-base">
              I hope you'll enjoy using SupaPile!{" "}
              <button
                className="underline cursor-pointer hover:opacity-50 text-inherit bg-transparent border-none p-0 font-inherit"
                onClick={() => {
                  window.open(
                    "https://mail.google.com/mail/?view=cm&fs=1&to=saiyanskai@gmail.com&su=SupaPile%20Feedback&body=Hi%20there!%0A%0AI%20have%20some%20feedback%20about%20SupaPile:%0A%0A",
                    "_blank"
                  );
                }}
              >
                Feedback
              </button>{" "}
              or ideas are always welcome to help make future updates even
              better.
            </p>
            {/* Article Footer */}
            <footer className="mt-8 sm:mt-10 py-4 sm:py-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <span>Follow me on X</span>
                </div>
                <div className="flex space-x-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  <a
                    href="https://x.com/superSaiyanSkai"
                    target="blank"
                    className="hover:underline cursor-pointer "
                  >
                    @superSaiyanSkai
                  </a>
                </div>
              </div>
            </footer>
          </>
        )}
      </article>
    </div>
  );
};

export default Updates;
