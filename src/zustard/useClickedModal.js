import { create } from "zustand";

const useClickedModal = create((set) => ({
  clicked: {
    pile:null,
    isOpen: null,
    modalType: null,
  },
  setTheModal: (state) => set({ clicked: {...state} }),
}));

export default useClickedModal;