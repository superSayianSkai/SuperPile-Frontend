import useFetchUserPublicPile from "../tanstack-query-hooks/useFetchPublicPile";
import { useParams } from "react-router";
import { useAuthStore } from "../zustard/useAuthStore";
import useClickedModal from "../zustard/useClickedModal";
import CustomToast from "../components/ShowCustomToast";
import ChangeCategoryContainer from "../components/ChangeCategoryContainer";
import { SupaPileAUTHContext } from "../context/SupaPileContext";
import { useContext } from "react";
import { useState } from "react";
import { Helmet } from "react-helmet-async";

const PublicPile = () => {
  const { handleSignIn } = useContext(SupaPileAUTHContext);

  const { setTheModal, clicked } = useClickedModal();
  const { publicLinkToken } = useParams();
  console.log(publicLinkToken);
  const { data, isLoading } = useFetchUserPublicPile(publicLinkToken);
  const { user: userData } = useAuthStore();

  const pile = data?.data;
  console.log("Full API response:", data);
  console.log("Pile data:", pile);
  
  // Keep your existing data structure
  const ownerName = data?.data?.[0]?.name || "Supapile User";
  
  // Get the first valid image from the pile, or use default
  const firstValidImage = pile?.find(link => link.image && link.image.trim() !== "" && link.image !== "undefined")?.image;
  const firstImage = firstValidImage || "https://supapile.com/og-image.png";
  
  const pileTitle = `${ownerName}'s Collection - Supapile`;
  const pileDescription = `Discover ${ownerName}'s curated collection of ${pile?.length || 0} links on Supapile. Save, organize and share your favorite URLs in one place.`;

  console.log("Owner name:", ownerName);
  console.log("First image:", firstImage);
  console.log("Pile length:", pile?.length);

  const [toast, setToast] = useState({ show: false, message: "" });

  const showCustomToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 3000);
  };

  const copy = (e) => {
    navigator.clipboard.writeText(e);
    showCustomToast("Copied to clipboard");
  };
  
  const handleLinkSubmit = async (link) => {
    localStorage.setItem("pending_link", link);
    handleSignIn();
  };

  // Don't render meta tags until we have data
  if (isLoading || !data || !pile) {
    return (
      <>
        <Helmet>
          <title>Loading Collection - Supapile</title>
          <meta name="description" content="Loading shared collection from Supapile" />
        </Helmet>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{pileTitle}</title>
        <meta name="title" content={pileTitle} />
        <meta name="description" content={pileDescription} />
        <meta name="keywords" content={`${ownerName}, supapile, shared links, bookmarks, collection, curated links, from supapile.com`} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://supapile.com/api/share/${publicLinkToken}`} />
        <meta property="og:title" content={pileTitle} />
        <meta property="og:description" content={pileDescription} />
        <meta property="og:image" content={firstImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={`Preview of ${ownerName}'s collection on Supapile`} />
        <meta property="og:site_name" content="Supapile" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@supapile" />
        <meta name="twitter:creator" content="@supapile" />
        <meta name="twitter:url" content={`https://supapile.com/api/share/${publicLinkToken}`} />
        <meta name="twitter:title" content={pileTitle} />
        <meta name="twitter:description" content={pileDescription} />
        <meta name="twitter:image" content={firstImage} />
        <meta name="twitter:image:alt" content={`Preview of ${ownerName}'s collection on Supapile`} />

        {/* Additional SEO tags */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content={`${ownerName} via Supapile`} />
        <link rel="canonical" href={`https://supapile.com/api/share/${publicLinkToken}`} />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": pileTitle,
            "description": pileDescription,
            "url": `https://supapile.com/api/share/${publicLinkToken}`,
            "image": firstImage,
            "author": {
              "@type": "Person",
              "name": ownerName
            },
            "publisher": {
              "@type": "Organization",
              "name": "Supapile",
              "url": "https://supapile.com",
              "logo": {
                "@type": "ImageObject",
                "url": "https://supapile.com/og-image.png"
              }
            },
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": pile?.length || 0,
              "itemListElement": pile?.slice(0, 5).map((link, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "WebPage",
                  "name": link.title || "Untitled",
                  "description": link.description || "",
                  "url": link.url,
                  "image": link.image || firstImage
                }
              })) || []
            }
          })}
        </script>
      </Helmet>

      <div className="lg:mx-[30px] mx-[1rem] md:px-0 ">
        {clicked.isOpen && <ChangeCategoryContainer />}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-[2rem] gap-y-[4rem]  relative pb-[45px]">
          {pile?.map((link) => {
            return (
              <div key={link._id} data={pile}>
                <div
                  draggable="true"
                  className="border-[1px] border-slate-300  rounded-xl overflow-clip flex flex-col justify-between cursor-pointer hover:opacity-90 "
                >
                  <a href={link.url} target="_blank" className="">
                    <div className="w-full aspect-[16/9] bg-black">
                      {link.image != "" || link.url === 0 ? (
                        <img
                          src={link.image}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full object-contain bg-black flex justify-center items-center font-bold ">
                          {link.title && (
                            <h1 className="text-[2rem] text-white uppercase">
                              {link.title}
                            </h1>
                          )}
                        </div>
                      )}
                    </div>
                  </a>
                </div>
                <div className="pt-[.8rem] px-[.7rem] flex flex-col gap-[5px] justify-between">
                  <h2 className="font-bold text-[.7rem]">{link.title}</h2>
                  <p className="text-gray-500 text-[.6rem] text-ellipsis mt-[10px]">
                    {link?.description?.slice(0, 152)}
                  </p>
                  {(
                    <div className="flex items-center w-[100%] pr-[1rem]">
                      <div className="flex gap-4  mt-[10px] items-center w-[100%]">
                        <button
                          onClick={() => copy(link.url)}
                          className="text-[15px]"
                        >
                          <i className="bi bi-clipboard hover:opacity-70 transition cursor-pointer "></i>
                        </button>
                        <button
                          onClick={() =>
                            setTheModal({
                              isOpen: true,
                              modalType: "share",
                              url: link.url,
                            })
                          }
                          className="text-[15px]"
                        >
                          <i className="bi bi-share hover:opacity-70 transition cursor-pointer "></i>
                        </button>

                        <button
                          onClick={() => handleLinkSubmit(link?.url)}
                          className="relative rounded-full text-[15px]"
                        >
                          <i className="bi bi-floppy hover:opacity-70 transition cursor-pointer"></i>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <CustomToast message={toast.message} show={toast.show} />
        </div>
      </div>
    </>
  );
};

export default PublicPile;
