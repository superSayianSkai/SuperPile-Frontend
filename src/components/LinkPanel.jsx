import { useContext, useRef } from "react";
import { SuperPileContext } from "../context/SuperPileContext";
import { useState } from "react";
import superpile from "../assets/thunder.png";
import axios from "axios";

// import anime from "../assets/Images/anime.jpeg";
const LinkPanel = () => {
  const regex = /https?:\/\/[\w.-]+\.[a-z]{2,}/;
  const textAreaRef = useRef();
  const secondTextAreaRef = useRef();
  const { addPile, setLinkBoardPanelToggle } = useContext(SuperPileContext);
  const [metaLink, setMetaLink] = useState("");
  const [meta, showMeta] = useState(false);
  const [loading, setLoading] = useState(false);

  const [metaInfo, setMetaInfo] = useState({
    title: "",
    description: "",
    image: "",
    link: "",
  });
  console.log(metaInfo);

  const titleMaxLength = 30;
  const descMaxLength = 104;

  const workOnSetTheMetaLink = (e) => {
    let link = e.target.value;
    setMetaLink(link);
    const input = e.target.value;
    if (input.match(regex)) {
      showMeta(true);
      setLoading(true);
    } else {
      showMeta(false);
    }
    ///
    
    axios
      .get(
        `  https://superpile-backend-1.onrender.com/fetchMetaData?url=${link}`
      )
      .then((response) => {
        // setMetaLink(link);
        setMetaInfo({
          image: response.data.image,
          title: response.data.title,
          description: response.data.description,
          link: link,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching metadata:", error);
      });
  };

  const handleSubmit = () => {
    addPile(metaInfo);
    setLinkBoardPanelToggle();
  };

  return (
    <div className="fixed inset-0 z-[1000] flex justify-center items-center transition-all duration-300 ease-in-out ">
      <div
        onClick={setLinkBoardPanelToggle}
        className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-10"
      ></div>
      <div className=" bg-white shadow-sm w-[93%] lg:w-[50%] absolute rounded-xl outline-none border-0 z-20  flex flex-col justify-center top-[6rem] md:top-[9rem] overflow-hidden ">
        <div className="w-[100%] h-[50px] flex  items-center  mt-2 border-[1px] border-t-0 border-r-0 border-l-0 px-[1rem]">
          <img src={superpile} className="w-[20px] h-[20px]" />
          <input
            onChange={workOnSetTheMetaLink}
            value={metaLink}
            placeholder="paste your Link"
            className="px-[1rem] h-] w-[100%]  outline-none border-0 "
          />
          <i
            onClick={handleSubmit}
            className="bi bi-arrow-right-circle-fill  z-30 text-2xl cursor-pointer "
          ></i>
        </div>
        {meta && (
          <div className="flex flex-col mt-5 justify-between  gap-5  ">
            <div className="flex flex-col justify-between gap-8 pb-6 px-[1rem] w-[100%]">
              {loading ? (
                <div className="w-[100%] flex flex-col md:flex-row  gap-8">
                  <div className="mt-2 ">
                    <div className="skeleton h-[120px] rounded-xl md:w-[200px]"></div>
                  </div>
                  <div className="flex flex-col gap-8 mt-4">
                    <div className="skeleton h-[10px] rounded-lg w-[300px]"></div>
                    <div className="flex flex-col gap-2">
                      <div className="skeleton h-[10px] rounded-lg w-[200px]"></div>
                      <div className="skeleton h-[10px] rounded-lg w-[350px]"></div>
                      <div className="skeleton h-[10px] rounded-lg w-[350px]"></div>
                      <div className="skeleton h-[10px] rounded-lg w-[350px]"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col md:flex-row gap-4 ">
                    <img
                      src={metaInfo.image}
                      className=" md:w-[250px] md:h-[200px]  object-cover rounded-xl  "
                    />
                    <div className="flex flex-col w-[100%] gap-2">
                      <h2
                        ref={textAreaRef}
                        name="title"
                        placeholder="write a title"
                        value={metaInfo.title}
                        className="font-bold  text-[1.2rem] scroll p-2 border-none outline-none text-ellipsis "
                        maxLength={titleMaxLength}
                      >
                        {metaInfo.title}
                      </h2>

                      <p
                        ref={secondTextAreaRef}
                        name="description"
                        placeholder="write a description"
                        value={metaInfo.description}
                        maxLength={descMaxLength}
                        style={{ resize: "none", overflow: "hidden" }}
                        className="text-[1rem] text-gray-500 text-wrap w-[100%] scroll p-2 text-ellipse"
                      >
                        {metaInfo.description}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkPanel;
