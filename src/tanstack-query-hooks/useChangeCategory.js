import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/axios";

const changeCategory = async ({ _id, category }) => {
  const response = await apiClient.post("/api/change-pile-category", {
    _id,
    category,
  });
  console.log(response);
  return response.data;
};

const useChangeCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changeCategory,

   onMutate: async ({ _id, category, fromCategory }) => {
  await queryClient.cancelQueries({ queryKey: ["pile", fromCategory] });
  await queryClient.cancelQueries({ queryKey: ["pile", category] });

  const previousFrom = queryClient.getQueryData(["pile", fromCategory]);
  const previousTo = queryClient.getQueryData(["pile", category]);

  const removedPile = previousFrom?.data?.find((post) => post._id === _id);

  // Remove from old category cache **only if it's NOT 'all'**
  if (fromCategory !== "all") {
    const updatedFromData = previousFrom?.data?.filter((post) => post._id !== _id) || [];
    queryClient.setQueryData(["pile", fromCategory], {
      data: updatedFromData,
    });
  }

  // Add to new category cache **only if new category is NOT 'all'**
  // Because you don't want UI to show it added in 'all'
  if (category !== "all" && category !== fromCategory && removedPile) {
    queryClient.setQueryData(["pile", category], {
      data: [...(previousTo?.data || []), removedPile].filter(Boolean),
    });
  }

  return { previousFrom, previousTo };
},
  


    onError: (error, variables, context) => {
      // Rollback to previous cache if mutation fails
      if (context?.previousFrom) {
        queryClient.setQueryData(
          ["pile", context.previousFrom],
          context.previousFrom
        );
      }
      if (context?.previousTo) {
        queryClient.setQueryData(
          ["pile", context.previousTo],
          context.previousTo
        );
      }
      console.error("Failed to change category:", error);
    },

    onSuccess: ({ category }) => {
      queryClient.invalidateQueries({ queryKey: ["pile", category] });
    },
  });
};

export default useChangeCategory;
