import { create } from "zustand";

const useStateStore=create((set)=>({
    supaPileState:{
        category:"all"
    },
    setCategory:(categoryInput)=>set((state)=>({supaPileState:{...state.supaPileState,category:categoryInput}})),
    setKeyword:(keywordInput)=>set((state)=>({supaPileState:{...state.supaPileState,keyword:keywordInput}})),
}))

export default useStateStore;