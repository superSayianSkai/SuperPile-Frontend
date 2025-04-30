import { useEffect } from "react";

const useOnClickOutside=(closeModal, toogleRef, modal)=>{
    useEffect(()=>{
        const doSomething=(event)=>{
         if (!toogleRef.current|| toogleRef.current.contains(event.target)){
          console.log("hey what are you up to?")
          console.log(event)
         return ;
        }
        closeModal(modal)
      }
        document.addEventListener("mousedown",doSomething)
    
        return () =>  document.removeEventListener("mousedown", doSomething)
      },[])
}

export default useOnClickOutside