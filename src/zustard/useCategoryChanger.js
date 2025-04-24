import { create } from "zustand";

const useCategoryChanger=create((set)=>({
    categoryChangerStore:null,
    setTheCategoryChangerStore:(pile) => set({ categoryChangerStore: pile }),
    
}))

export default useCategoryChanger