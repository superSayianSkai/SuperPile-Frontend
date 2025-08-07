import { create } from "zustand";
import apiClient from "../lib/axios";

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: true,
  isError: false,
  error: null,

  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (isError, error) => set({ isError, error }),

  getUser: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get("/auth/me");
      set({
        user: response.data,
        isLoading: false,
        isError: false,
        error: null,
      });
    } catch (err) {
      set({
        user: null,
        isLoading: false,
        isError: true,
        error: err,
      });
    }
  },
}));
