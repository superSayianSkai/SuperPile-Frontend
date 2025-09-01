import { create } from "zustand";

export const useError = create((set) => ({
  error: "",
  timestamp: 0,
  setError: (message) => set({ error: message, timestamp: Date.now() }),
  clearError: () => set({ error: "", timestamp: 0 }),
}));
