import { create } from "zustand";

export const usePostStore = create((set) => ({
  postData: null,
  pendingPosted: false,
  global:false,
  isPostSuccess: false,
  
  setGlobal: () => set((state) => ({ global: !state.global })),
  setPostData: (postData) => set({ postData, pendingPosted: true }),
  resetPending: () => set({ pendingPosted: false }),
  setPostSuccess: (value) => set({ isPostSuccess: value }),
}));