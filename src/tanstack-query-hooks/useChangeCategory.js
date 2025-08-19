import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/axios";

const changeCategory = async ({ _id, category }) => {
  const response = await apiClient.patch(`/api/v1/piles/${_id}`, {
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
      const fromKey = ["pile", fromCategory, ""];
      const toKey = ["pile", category, ""];

      await queryClient.cancelQueries({ queryKey: fromKey });
      await queryClient.cancelQueries({ queryKey: toKey });

      const previousFrom = queryClient.getQueryData(fromKey);
      const previousTo = queryClient.getQueryData(toKey);

      let removedPile = null;

      // Remove from old category unless it's "all"
      if (fromCategory !== "all" && previousFrom?.pages) {
        const newFromPages = previousFrom.pages.map((page) => {
          const filteredPiles = page.piles.filter((pile) => {
            const match = pile._id === _id;
            if (match) removedPile = pile;
            return !match;
          });
          return { ...page, piles: filteredPiles };
        });

        queryClient.setQueryData(fromKey, {
          ...previousFrom,
          pages: newFromPages,
        });
      } else if (fromCategory === "all" && previousFrom?.pages) {
        // Still find removedPile to transfer to new category
        for (const page of previousFrom.pages) {
          const match = page.piles.find((pile) => pile._id === _id);
          if (match) {
            removedPile = match;
            break;
          }
        }
      }

      // Add to new category
      if (removedPile) {
        const newToPages = previousTo?.pages?.length
          ? [...previousTo.pages]
          : [{ piles: [], nextPage: undefined }];

        newToPages[0].piles = [removedPile, ...(newToPages[0].piles || [])].sort(
          (a, b) => b._id.localeCompare(a._id)
        );

        queryClient.setQueryData(toKey, {
          pages: newToPages,
          pageParams: previousTo?.pageParams ?? [undefined],
        });
      }

      return { previousFrom, previousTo };
    },
  


    onError: (error, variables, context) => {
      if (context?.previousFrom) {
        const fromKey = ["pile", variables.fromCategory];
        queryClient.setQueryData(fromKey, context.previousFrom);
      }
      if (context?.previousTo) {
        const toKey = ["pile", variables.category];
        queryClient.setQueryData(toKey, context.previousTo);
      }
      console.error("Failed to change category:", error);
    },

    onSuccess: ({ category }) => {
      queryClient.invalidateQueries({ queryKey: ["pile", category, ""] });
    },
  });
};

export default useChangeCategory;
