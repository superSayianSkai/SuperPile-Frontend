import pokiemon from "../assets/Images/pokiemon.gif";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Helmet } from "react-helmet-async";

const Updates = () => {
  const [imageLoaded, setImageLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };
  const handleImageLoading = () => {
    setImageLoading(true);
  };
  return (
    <div className="overflow-y-auto bg-gray-50 dark:bg-black py-4 sm:py-8 relative">
      <Helmet>
        {/* Title for tab + search engines */}
        <title>Updates - Supapile v1.0 Launch</title>

        {/* Description for Google and social previews */}
        <meta
          name="description"
          content="Supapile v1.0 is here! Learn about the new features and improvements in our latest update. Save, organize and share your favorite URLs with ease."
        />

        {/* Open Graph tags for better previews on Twitter, LinkedIn, etc. */}
        <meta
          property="og:title"
          content="Supapile v1.0 Launch - Updates & New Features"
        />
        <meta
          property="og:description"
          content="Discover what's new in Supapile v1.0. Enhanced link saving, better organization, and improved sharing features."
        />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://www.supapile.com/updates" />
        <meta property="og:image" content="https://supapile.com/og-image.png" />

        {/* Twitter card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Supapile v1.0 Launch - Updates & New Features"
        />
        <meta
          name="twitter:description"
          content="Discover what's new in Supapile v1.0. Enhanced link saving, better organization, and improved sharing features."
        />
        <meta
          name="twitter:image"
          content="https://supapile.com/og-image.png"
        />

        {/* Article specific meta tags */}
        <meta
          property="article:published_time"
          content="2024-09-24T00:00:00Z"
        />
        <meta property="article:author" content="skai" />
        <meta property="article:section" content="Product Updates" />
        <meta property="article:tag" content="product launch" />
        <meta property="article:tag" content="updates" />
        <meta property="article:tag" content="features" />
      </Helmet>

      {/* Back Navigation - positioned at page edge on desktop */}
      <div className="sm:absolute sm:left-4 sm:top-8 sm:z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-0 mb-4 sm:mb-0">
          <button
            onClick={handleGoBack}
            className="inline-flex items-center gap-2 px-0 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>
      </div>

      <article className="max-w-4xl mx-auto overflow-hidden px-4 sm:px-6 lg:px-8">
        {/* Product Launch Header */}
        <header className="py-4 sm:py-6">
          <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-6">
            <div className="bg-black hidden dark:block dark:bg-white rounded-lg px-3 sm:px-4 py-2 h-[35px] shadow-md">
              <div className="text-center">
                <div className="text-sm sm:text-[.8rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">
                  1.0
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r block dark:hidden from-pink-500 to-orange-500 rounded-lg px-3  sm:px-4 py-2 h-[35px] shadow-md">
              <div className="text-center">
                <div className="text-sm font-bold text-white dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-pink-500 dark:to-orange-500">
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
                  September 28, 2025
                </time>
              </div>
            </div>
          </div>

          <h1 className="text-[1.6rem] sm:text-4xl lg:text-5xl dark:text-white font-bold text-gray-900 mb-4 leading-tight">
            Link, I choose you!
          </h1>
        </header>

        {/* Article Content */}
        <div className="py-1">
          {/* Featured Image - now responsive */}
          <figure className="mb-6 sm:mb-8">
            <div className="w-full max-w-4xl h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden mx-auto rounded-lg ">
              {!imageLoaded && (
                <div className="relative w-full h-[100%] bg-gray-200 dark:bg-gray-100/50 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-60 animate-shimmer"></div>
                </div>
              )}

              <img
                onLoad={handleImageLoading}
                src={pokiemon}
                className="w-full h-full object-cover"
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
                <p className="leading-[1.8rem]">
                  I love to curate websites, especially the ones I find useful
                  or can learn from. For the longest time, I&apos;d just dump
                  them into my WhatsApp &quot;me&quot; chat for later… but over
                  time, it became a chaotic mess.
                </p>

                <p className="leading-[1.8rem]">
                  I tried switching to bookmarks, but honestly, it was worse,
                  I&apos;d forget about them completely, and the whole setup
                  just didn&apos;t work for me.
                </p>

                <p className="leading-[1.8rem]">
                  At work, people often asked if I had good resources to share.
                  Most times, I&apos;d be scrolling endlessly through my messy
                  WhatsApp &quot;me&quot; chat just to find one link.
                </p>

                <p className="leading-[1.8rem]">
                  Then one day, a colleague told me she hated how her links were
                  scattered. Apparently, she was also saving them on WhatsApp,
                  but it just felt messy and clunky. Not long after, another
                  colleague said the exact same thing
                </p>

                <p className="font-semibold leading-[1.8rem]">
                  That&apos;s when I decided to build Supapile, a place to store
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
                  <span className="text-sm sm:text-base leading-[1.8rem]">
                    Save and categorize your favorite links faster than
                    lightning.
                  </span>
                </li>
                <li className="flex items-start leading-[1.8rem]">
                  <span className="text-black dark:text-white mr-2 flex-shrink-0">
                    •
                  </span>
                  <span className="text-sm sm:text-base leading-[1.8rem]">
                    Share piles you&apos;ve made visible on your Pileboard with
                    friends.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-black dark:text-white mr-2 flex-shrink-0">
                    •
                  </span>
                  <span className="text-sm sm:text-base leading-[1.8rem]">
                    Use the{" "}
                    <a
                      href="https://chromewebstore.google.com/detail/supapile/dijfgnlpkjppccgkiapcppdkeiekemah/"
                      target="_blank"
                      className="underline hover:opacity-70"
                    >
                      Supapile extension
                    </a>{" "}
                    to save links from any site instantly—no.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-black dark:text-white mr-2 flex-shrink-0">
                    •
                  </span>
                  <span className="text-sm sm:text-base leading-[1.8rem]">
                    Add Supapile to your device like an app so you can open it
                    instantly.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-black dark:text-white mr-2 flex-shrink-0">
                    •
                  </span>
                  <span className="text-sm sm:text-base leading-[1.8rem]">
                    On Android, once you add Supapile as an app, you can easily
                    share links to it directly from other apps.
                  </span>
                </li>
              </ul>

              <h3 className="text-xl sm:text-2xl dark:text-white font-semibold text-gray-800 mt-8 mb-3 sm:mb-4">
                Design Philosophy
              </h3>

              <div className="text-sm sm:text-base dark:text-white space-y-3 sm:space-y-4">
                <p className="leading-[2rem]">
                  When I designed the Supapile icon, I drew inspiration from
                  Pokémon. Just like trainers collect, organize, and share their
                  Pokémon, I wanted Supapile to do the same for your favorite
                  links. The Pokéball-inspired design captures that ‘gotta catch
                  ’em all’ spirit but for web resources.
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-gray-700 max-w-4xl mx-auto dark:text-gray-300 mt-6 sm:mt-8 text-sm sm:text-base leading-[1.8rem]">
          I really hope you&apos;ll enjoy using Supapile!{" "}
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
          or ideas are always welcome to help make future updates even better.
          Arigatō gozaimasu!
        </p>
        {/* Article Footer */}
        <footer className="mt-8 sm:mt-10 py-4 sm:py-6 mb-4 sm:mb-8 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700  p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <span>Follow me on X</span>
            </div>
            <div className="flex space-x-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              <a
                href="https://x.com/superSaiyanSkai"
                target="blank"
                className="hover:underline cursor-pointer underline hover:opacity-80"
              >
                @superSaiyanSkai
              </a>
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
};

export default Updates;
