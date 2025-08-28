import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/axios";
import { useAuthStore } from "../zustard/useAuthStore";

const logoutUser = async () => {
  const response = await apiClient.post("/auth/logout");
  return response.data;
};

const useLogout = () => {
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      // Use the logout method from store
      logout();
      
      // Clear all React Query cache
      queryClient.clear();
      
      // Clear service worker caches
      if ('serviceWorker' in navigator && 'caches' in window) {
        caches.keys().then(cacheNames => {
          Promise.all(
            cacheNames.map(cacheName => caches.delete(cacheName))
          );
        });
      }
      
      // Send message to service worker to force refresh
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'FORCE_REFRESH'
        });
      }
      
      // Redirect to onboarding page
      window.location.href = '/onBoarding';
    },
    onError: (error) => {
      console.error('Logout error:', error);
      // Even if logout fails, clear local state and redirect
      logout();
      queryClient.clear();
      window.location.href = '/onBoarding';
    }
  });
};

export default useLogout;