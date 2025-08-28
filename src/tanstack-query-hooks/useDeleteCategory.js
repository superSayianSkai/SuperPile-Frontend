import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/axios";

const deleteCategory = async (categoryName) => {
  return await apiClient.delete(`/api/v1/piles/categories/${categoryName}`);
};

const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,

    onSuccess: () => {
      // Invalidate and refetch categories
      queryClient.invalidateQueries({ queryKey: ["category"] });
      
      // Invalidate all pile queries since piles may have been moved to 'all' category
      queryClient.invalidateQueries({ queryKey: ["pile"], exact: false });
      
      // Clear service worker cache for category and pile endpoints
      if ('serviceWorker' in navigator && 'caches' in window) {
        caches.open('supapile-api-v3').then(cache => {
          cache.keys().then(keys => {
            keys.forEach(key => {
              if (key.url.includes('/api/v1/categories') || key.url.includes('/api/v1/piles')) {
                cache.delete(key);
              }
            });
          });
        });
      }
    },

    onError: (error) => {
      console.error("❌ Delete category failed:", error);
    },
  });
};

export default useDeleteCategory;