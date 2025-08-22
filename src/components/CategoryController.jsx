import { useContext, useRef} from "react"
import { StateContext } from "../context/SupaPileContext"
import Category from "./Category"
import useCategoryStore from "../zustard/useCategoryStore"
import useOnClickOutside from "../hooks/useOnClickOutside"
const CategoryController = ({id}) => {
  const {closeModal ,toggleCategory,modals}=useCategoryStore()
  const {tick}=useContext(StateContext)
  const toogleRef= useRef()
  useOnClickOutside(closeModal,toogleRef, id)
  return (
    <div ref={toogleRef} onClick={()=>toggleCategory(id)}  className="user-select-none flex gap-2 items-center justify-center cursor-pointer relative">
          <h2 className="font-bold user-select-none text-[.8rem] md:text-[.8rem] capitalize">{tick}</h2>
          <i className={`text-[1rem] transition-transform duration-300 ease-in-out ${
            modals.pickCategory 
              ? 'bi bi-x rotate-180' 
              : 'bi bi-plus rotate-0'
          }`}></i>
          {
            modals.pickCategory &&(
              <Category />
            )
          }
    </div>
  )
}

export default CategoryController