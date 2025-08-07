import { create } from "zustand";

export const useError = create((set) => ({
  error: "",
  setError: (message) => set({ error: message }),
}));
