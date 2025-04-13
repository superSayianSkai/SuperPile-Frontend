import { useContext, useRef } from "react";
import { SupaPileContext } from "../context/SupaPileContext";
import { useState } from "react";
import pokimon from "../assets/Images/pokimon.svg";
import useMeta from "../hooks/useMeta";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import postURL from "../hooks/usePostURL";
const LinkPanel = () => {
  const regex = /https?:\/\/[\w.-]+\.[a-z]{2,}/;
  const textAreaRef = useRef();
  const secondTextAreaRef = useRef();
  const { setLinkBoardPanelToggle } = useContext(SupaPileContext);
  const [metaLink, setMetaLink] = useState("");
  const [meta, showMeta] = useState(false);
  const { data, isLoading, isError } = useMeta({ link: metaLink });
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: postURL,
    onSuccess: () => {
      queryClient.invalidateQueries(["pile"]);
    },

    onMutate: async (newPost) => {
      const previousPosts = queryClient.getQueryData(["pile"])?.data.data || [];
      queryClient.setQueryData(["pile"], {
        data: {
          data: [
            ...previousPosts,
            {
              _id: Date.now(),
              image: "",
              description: "",
              title: "",
              url: newPost,
            },
          ],
        },
      });
      return { previousPosts };
    },

    onError: (err) => {
      console.log(err);
    },
  });

  const titleMaxLength = 30;
  const descMaxLength = 104;

  const workOnSetTheMetaLink = (e) => {
    const input = e.target.value;
    if (input.match(regex)) {
      showMeta(true);
      setMetaLink(input);
    } else {
      showMeta(false);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(metaLink);
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
          <img src={pokimon} className="w-[20px] h-[20px]" />
          {/* need to fix the icon */}
          <input
            onChange={workOnSetTheMetaLink}
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
                  <div className="flex flex-col md:flex-row gap-4 ">
                    <img
                      src={data.image}
                      className=" md:w-[250px] md:h-[200px]  object-cover rounded-xl  "
                    />
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
                        {data.description}
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
