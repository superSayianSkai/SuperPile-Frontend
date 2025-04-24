import { create } from "zustand";

const useCategoryStore=create((set)=>({
isOpen: false,
setCategoryOpen: () => set({ isOpen: true }),
setCategoryClose: () => set({ isOpen: false }),
toggleCategory: () => set((state) => ({ isOpen: !state.isOpen })),

}))

export default useCategoryStore;