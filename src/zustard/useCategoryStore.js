import { create } from "zustand";

const useCategoryStore=create((set)=>({
modals: {},
closeModal:(id)=> set((state)=>({modals:{...state.modals,[id]:false}})),
toggleCategory: (id) => set((state) => ({modals:{...state.modals,[id]:!state.modals[id]}})),
}))

export default useCategoryStore;