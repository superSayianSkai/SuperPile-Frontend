import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/axios";
import { useError } from "../zustard/useError";

const createCategory = async ({ categoryName }) => {
  const response = await apiClient.post("/api/v1/piles/categories", {
    categoryName,
  });
  return response.data;
};

const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const setError = useError((state) => state.setError);
  return useMutation({
    mutationFn: createCategory,
    onSuccess: (data) => {
      // Invalidate and refetch categories to include the new one
      queryClient.invalidateQueries({ queryKey: ["category"] });
      return data;
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to save pile";
      setError(errorMessage);

      console.error("Failed to create category:", error);
      throw error;
    },
  });
};

export default useCreateCategory;
