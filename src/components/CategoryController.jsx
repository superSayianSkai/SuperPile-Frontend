import { useContext, useRef} from "react"
import { StateContext } from "../context/SupaPileContext"
import Category from "./Category"
import useCategoryStore from "../zustard/useCategoryStore"
import useOnClickOutside from "../hooks/useOnClickOutside"
const CategoryController = ({id}) => {
  console.log(id)
  const {closeModal ,toggleCategory,modals}=useCategoryStore()
  const {tick}=useContext(StateContext)
  const toogleRef= useRef()
  useOnClickOutside(closeModal,toogleRef, id)
  return (
    <div ref={toogleRef} onClick={()=>toggleCategory(id)}  className="user-none flex gap-2 items-center justify-center cursor-pointer relative">
          <h2 className="font-bold text-[.8rem] md:text-[.8rem] capitalize">{tick}</h2>
          <i className="bi bi-chevron-down text-[.8rem]"></i>
          { console.log(modals)}
          {
            modals.pickCategory &&(
              <Category />
            )
          }
    </div>
  )
}

export default CategoryController