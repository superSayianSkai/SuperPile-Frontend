import { useContext, useRef } from "react";
import { StateContext } from "../context/SupaPileContext";
import { useState } from "react";
import pokimon from "../assets/Images/pokimon.svg";
import useMeta from "../tanstack-query-hooks/useMeta";
import usePostPile from "../tanstack-query-hooks/usePostPile";
const PilePanel = () => {
  const regex = /https?:\/\/[\w.-]+\.[a-z]{2,}/;
  const textAreaRef = useRef();
  const secondTextAreaRef = useRef();
  const {
    setLinkBoardPanelToggle,
    modifyTheHostName,
    metaLink,
    hostNameSentence,
    setTheMetaLink,
  } = useContext(StateContext);
  const [meta, showMeta] = useState(false);
  const [categoryInput,setCategoryInput]=useState()
  const { data, isLoading } = useMeta({ link: metaLink });
  const { mutate } = usePostPile();
  const titleMaxLength = 30;
  const descMaxLength = 104;
  const theCategoryInput=(e)=>{
    setCategoryInput(e.target.value);
   }
  const workOnSetTheMetaLink = (e) => {
    const input = e.target.value;
    if (input.match(regex) ) {
      showMeta(true);
      setTheMetaLink(input);
      modifyTheHostName(input);
    } else {
      showMeta(false);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
        mutate({"url":metaLink,"category":categoryInput});
    setLinkBoardPanelToggle();
  };
  console.log(categoryInput);
  return (
    <div className="fixed inset-0 z-[1000] flex justify-center items-center transition-all duration-300 ease-in-out ">
      <div
        onClick={setLinkBoardPanelToggle}
        className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-10"
      ></div>
      <div className=" bg-white shadow-sm w-[93%] lg:w-[50%] absolute rounded-xl outline-none border-0 z-20  flex flex-col justify-center top-[6rem] md:top-[6rem] overflow-hidden h-auto">
        <div className="w-[100%] h-[50px] flex  items-center  mt-2 border-[1px] border-t-0 border-r-0 border-l-0 px-[1rem]">
          <img src={pokimon} className="w-[20px] h-[20px]" />
          {/* need to fix the icon */}
         <form onSubmit={handleSubmit} className="flex w-[100%]">
          <input
            onChange={workOnSetTheMetaLink}
            placeholder="paste your Link"
            className="px-[1rem] h-] w-[100%]  outline-none border-0 "
          />
          <button>
          <i
            className="bi bi-arrow-right-circle-fill  z-30 text-2xl cursor-pointer "
          ></i>
          </button>
        </form>
        </div>
        {meta && (
          <div className="flex flex-col mt-5 justify-between  gap-5  ">
            <div className="flex flex-col justify-between gap-8 px-[1rem] w-[100%]">
              {isLoading ? (
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
                  <div className="flex flex-col md:flex-row gap-4">
                  {
                    data.image?.length > 1 ?(

                    <img
                      src={data.image}
                      className=" md:w-[250px] md:h-[200px]  object-cover rounded-xl  "
                    />
                    ) :
                    (
                      
                      <div className="w-full h-[300px] md:h-[200px] rounded-xl object-contain bg-black flex justify-center items-center font-bold text-[2rem] text-white uppercase text-center">
                     
                            {data.title}
                        
                     
                      </div>
                    ) }
                    <div className="flex flex-col w-[100%] gap-2">
                      <h2
                        ref={textAreaRef}
                        name="title"
                        placeholder="write a title"
                        value={data.title}
                        className="font-bold  text-[1.2rem] scroll p-2 border-none outline-none text-ellipsis "
                        maxLength={titleMaxLength}
                      >
                        {data.title}
                      </h2>

                      <p
                        ref={secondTextAreaRef}
                        name="description"
                        placeholder="write a description"
                        value={data.description}
                        maxLength={descMaxLength}
                        style={{ resize: "none", overflow: "hidden" }}
                        className="text-[1rem] text-gray-500 text-wrap w-[100%] scroll p-2 text-ellipse"
                      >
                      {console.log(data.description)}
                        {data.description ? data.description :hostNameSentence}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="flex flex-col md:flex-row gap-4 text-[1rem] font-bold border-t-2 p-[1rem] items-center justify-between p-577  ">
            <h2>
            Create a Category
            </h2>
            <input value={categoryInput} defaultValue={"All"} onChange={theCategoryInput} className="px-2 border-2 border-black text-[1rem] rounded-md capitalize" maxLength={20} placeholder="maxlength=20  "/>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PilePanel;
