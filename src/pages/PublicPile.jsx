import useFetchUserPublicPile from "../tanstack-query-hooks/useFetchPublicPile";
import { useParams } from "react-router";
import { useAuthStore } from "../zustard/useAuthStore";
import useClickedModal from "../zustard/useClickedModal";
import CustomToast from "../components/ShowCustomToast";
import ChangeCategoryContainer from "../components/ChangeCategoryContainer";
import { SupaPileAUTHContext } from "../context/SupaPileContext";
import { useContext } from "react";
import { useState } from "react";
const PublicPile = () => {
  const { handleSignIn } = useContext(SupaPileAUTHContext);

  const { setTheModal, clicked } = useClickedModal();
  const { publicLinkToken } = useParams();
  console.log(publicLinkToken);
  const { data } = useFetchUserPublicPile(publicLinkToken);
  const { user: userData } = useAuthStore();

  const pile = data?.data;

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

  console.log(data);
  console.log("hjshs");
  return (
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
                {!userData && (
                  <div className="flex items-center w-[100%] pr-[1rem]">
                    <div className="flex gap-4  mt-[10px] items-center w-[100%]">
                      <button
                        onClick={() => copy(link.url)}
                        className="text-[15px]"
                      >
                        <i className="bi bi-clipboard hover:text-gray-500 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#ff66b2] hover:to-[#ff8c00] transition cursor-pointer "></i>
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
                        <i className="bi bi-share hover:text-gray-500 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#ff66b2] hover:to-[#ff8c00] transition cursor-pointer "></i>
                      </button>

                      <button
                        onClick={() => handleLinkSubmit(link?.url)}
                        className="relative rounded-full text-[15px]"
                      >
                        <i className="bi bi-floppy hover:text-gray-500 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#ff66b2] hover:to-[#ff8c00] transition cursor-pointer"></i>
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
  );
};

export default PublicPile;
