import Header from "../components/Header.jsx"
import useFetchArchivedPile from "../tanstack-query-hooks/useFetchArchivedPile.js"
import useHardDeletePile from "../tanstack-query-hooks/useHardDeletePile.js"
import useRestorePile from "../tanstack-query-hooks/useRestorePile.js"
const ArchivedPage = () => {
  const {data} = useFetchArchivedPile()
  const {mutate} = useHardDeletePile()
  const {mutate:fetchMutate}= useRestorePile()
  const pile = data?.data;
  const hardDelete = (e) => {
    console.log(e);
    mutate(e);
  };
  console.log(pile)
  return (
    <div className="h-[100svh]">
    <Header/>
    <div className="flex justify-center">
    <h2 className="text-[2.3rem] font-bold pt-[2rem] color">Archived</h2>
    </div>
    <div className=" py-[20px] lg:mx-[30px] mx-[1rem] md:px-0 ">
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-[2rem] gap-y-[4rem]  relative py-[70px]">
      {pile?.map((link) => {
        return (
          <div key={link._id}>
            <div
              draggable="true"
              className="border-[1px] border-slate-300  rounded-xl overflow-clip flex flex-col justify-between cursor-pointer hover:opacity-90 "
            >
              <a href={link.url} target="_blank" className="">
      
              <div className="w-full aspect-[16/9] bg-black">
            
                    {link.image!="" ? (
                      <img
                        src={link.image}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full object-contain bg-black flex justify-center items-center font-bold ">
                
                          <h1 className="text-[2rem] text-white uppercase">
                            {link.title}
                          </h1>
                      
                      </div>
                    )}
                  </div>
              </a>
            </div>
            <div className="pt-[.8rem] px-[.7rem] flex flex-col gap-[5px] justify-between">
              <h2 className="font-bold text-[.7rem]">
                {link.title}
              </h2>
              <p className="text-gray-500 text-[.6rem] text-ellipsis mt-[10px]">
              {link?.description}

              </p>
              <div className="flex items-center w-[100%] pr-[1rem]">
                <div className="flex gap-4  mt-[10px] items-center w-[100%]">
                    {/* onClick={() => copy(link.url)} */}
                  <button
                    className="text-[15px]"
                  >
                    <i className="bi bi-clipboard hover:text-gray-500 "></i>
                  </button>
                  
                  <button className="rounded-full  text-[15px]">
                    <i
                     onClick={() => hardDelete({ _id: link._id})}
                      className="bi bi-trash3 text-red-600 hover:text-gray-500   cursor-pointer"
                    ></i>
                  </button>
                 {console.log(link.category)}
                  <button onClick={()=>fetchMutate({_id:link._id, category:link.category})}  className="relative rounded-full text-[15px]"> 
                  <i className="bi bi-arrow-repeat hover:text-gray-500"></i>
                    </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
</div>
    </div>
  )
}

export default ArchivedPage