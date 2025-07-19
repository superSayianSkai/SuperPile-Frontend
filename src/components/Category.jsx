import { useContext} from "react"
import { StateContext } from "../context/SupaPileContext"
import { useFetchCategory } from "../tanstack-query-hooks/useFetchCategory";
// import useCategoryStore from "../zustard/useCategoryList";
import useStateStore from "../zustard/useStateStore";
const Category = () => {
    const {tick,setTheTick} =useContext(StateContext);
    const {setCategory}=useStateStore()

    const pressSomething=(e)=>{
      setTheTick(e)
      setCategory(e)
    }
    const {data}=useFetchCategory()
    let category= data?.data.categories||[]
  return (
        <div className="border-2 bg-white text-black w-[200px]  h-[130px] overflow-y-scroll scroll-smooth scroll overflow-hidden -left-2 z-[2] rounded-lg flex flex-col gap-2 absolute top-6 cursor-pointer">
        {
  category
    ?.slice() 
    .sort((a,b) =>(a==="all" ? -1: b ==="all" ? 1 :0 ))
    .map((c, index) => {
      return (
        <div key={index} className="flex justify-between capitalize px-3 py-2 hover:bg-gray-200">
          <h1 onClick={() => pressSomething(c)} className="text-[.8rem] w-[100%]">{c}</h1>
          {tick === c && <i className="bi bi-check2 text-[.8rem]"></i>}
        </div>
      );
    })
}       </div>
      )
    }
   
export default Category