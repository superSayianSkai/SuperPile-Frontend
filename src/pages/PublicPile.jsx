import useFetchUserPublicPile from "../tanstack-query-hooks/useFetchPublicPile";
import { useParams } from "react-router";
import { toast } from "react-toastify";
const PublicPile = () => {
  const { uuID } = useParams();
  console.log(uuID);
  const { data } = useFetchUserPublicPile(uuID);

  const copy = (e) => {
    navigator.clipboard.writeText(e);
    toast.success("copied to clipboard");
  };
  const pile = data?.data;
  const shareNavigator = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title: "Check this out!", url });
        return;
      } catch (error) {
        console.error("Sharing failed", error);
      }
    }

    // Fallback: open WhatsApp Web with prefilled message
    const encodedURL = encodeURIComponent(url);
    const whatsappURL = `https://web.whatsapp.com/send?text=${encodedURL}`;
    window.open(whatsappURL, "_blank");

    // Optionally also copy to clipboard
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    } catch (error) {
      console.error("Clipboard copy failed:", error);
      alert("Could not copy link. Please copy manually.");
    }
  };
  console.log(data);
  console.log("hjshs");
  return (
    <div className="py-[20px] lg:mx-[30px] mx-[1rem] md:px-0 ">
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
                <div className="flex items-center w-[100%] pr-[1rem]">
                  <div className="flex gap-4  mt-[10px] items-center w-[100%]">
                    <button
                      onClick={() => copy(link.url)}
                      className="text-[15px]"
                    >
                      <i className="bi bi-clipboard hover:text-gray-500 "></i>
                    </button>
                    <button
                      onClick={() =>
                        shareNavigator({
                          title: "whatsapp",
                          text: link.url,
                          url: "https://web.whatsapp.com/",
                        })
                      }
                      className="text-[15px]"
                    >
                      <i className="bi bi-share hover:text-gray-500 "></i>
                    </button>

                    <button
                      // onClick={() => handleClick(link._id)}
                      className="relative rounded-full text-[15px]"
                    >
                      <i className="bi bi-bookmark-check hover:text-gray-500"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PublicPile;
