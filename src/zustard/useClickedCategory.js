import { create } from "zustand";

const useClickedCategory=create((set)=>(
{
    clickedPile:null,
    setTheClickedPile:(state)=> set({clickedPile:state})
}))

export default useClickedCategory   