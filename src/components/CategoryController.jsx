import { useContext, useRef, useEffect } from "react"
import { StateContext } from "../context/SupaPileContext"
import Category from "./Category"
import useCategoryStore from "../zustard/useCategoryList"

const CategoryController = () => {
  const {setCategoryClose,toggleCategory}=useCategoryStore()
  const {tick}=useContext(StateContext)
  const toogleRef= useRef()
  useEffect(()=>{
    const doSomething=(event)=>{
     if (!toogleRef.current|| toogleRef.current.contains(event.target)){
      console.log(event)
     return ;
    }
    setCategoryClose()
  }
    document.addEventListener("mousedown",doSomething)

    return () =>  document.removeEventListener("mousedown", doSomething)
  },[])
  console.log(toogleRef.current)
  return (
    <div ref={toogleRef} onClick={()=>toggleCategory()}  className="user-none flex gap-2 items-center justify-center cursor-pointer relative">
          <h2 className="font-bold text-[.8rem] md:text-[.8rem] capitalize">{tick}</h2>
          <Category/>
    </div>
  )
}

export default CategoryController