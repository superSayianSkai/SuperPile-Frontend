import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/axios";

const createCategory = async ({ categoryName }) => {
  const response = await apiClient.post("/api/v1/piles/categories", {
    categoryName,
  });
  return response.data;
};

const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: (data) => {
      // Invalidate and refetch categories to include the new one
      queryClient.invalidateQueries({ queryKey: ["category"] });
      return data;
    },
    onError: (error) => {
      console.error("Failed to create category:", error);
      throw error;
    },
  });
};

export default useCreateCategory;
