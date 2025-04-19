import { useContext } from "react"
import { StateContext } from "../context/SupaPileContext"
const CategoryController = () => {
  const {setTheCategoryState,tick}=useContext(StateContext)
  return (
    <div onClick={()=>setTheCategoryState()}  className="user-none flex gap-2 items-center justify-center cursor-pointer">
          <h2 className="font-bold text-[.8rem] md:text-[.8rem] capitalize">{tick}</h2>
          <i className="bi bi-chevron-down text-[.7rem]"></i>
    </div>
  )
}

export default CategoryController