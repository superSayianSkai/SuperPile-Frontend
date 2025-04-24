import { useContext} from "react"
import { StateContext } from "../context/SupaPileContext"
import { useFetchCategory } from "../tanstack-query-hooks/useFetchCategory";
import useCategoryStore from "../zustard/useCategoryList";
const Category = () => {
    const {tick,setTheTick} =useContext(StateContext);
    const {isOpen}=useCategoryStore();  
    const {data}=useFetchCategory()
    const category= data?.data.data.categories
    console.log(tick)
    
  return isOpen ? (
        <div className="border-2 bg-white text-black w-[200px]  h-auto -left-2 z-[2] rounded-lg flex flex-col gap-2 absolute top-6 cursor-pointer">
        {
          category?.slice().reverse().map((c,index)=>{
            return(
        <div key={index} className="flex justify-between capitalize px-3 py-2 hover:bg-gray-200  ">
          <h1 value={index} onClick={()=>setTheTick(c)} className="text-[.8rem] w-[100%]">{c}</h1>
          {tick === c  && (<i className="bi bi-check2 text-[.8rem]"></i>) }
          {console.log(c)}
        </div>
          )})
        }
        </div>
      ):""
    }
   
export default Category