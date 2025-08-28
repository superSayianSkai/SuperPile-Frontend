import { create } from "zustand";
import apiClient from "../lib/axios";

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: true,
  isError: false,
  error: null,

  setUser: (user) => set({ user, isLoggedOut: false }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (isError, error) => set({ isError, error }),

  // Add logout method
  logout: () => set({ user: null, isLoggedOut: true, isLoading: false, error: { hasError: false, errorMessage: null } }),

  getUser: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get("/auth/user");
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
