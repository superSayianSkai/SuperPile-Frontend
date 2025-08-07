import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/axios";

const changeVisibility = async ({ _id, category }) => {
  console.log(_id, category);
  try {
    const response = await apiClient.put("/api/change-visibility", { _id, category });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const useChangeVisibility = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: changeVisibility,
    onMutate: async ({ _id, category }) => {
      await queryClient.cancelQueries(["pile", category]);

      const previousCategoryData = queryClient.getQueryData(["pile", category, ""]);
      const matchingPile = previousCategoryData?.pages.flatMap(page => page.piles).find(pile => pile._id === _id);
      const newVisibility = matchingPile ? !matchingPile.visibility : true;

      queryClient.setQueryData(["pile", category, ""], (oldData) => {
        if (!oldData || !oldData.pages) {
          return oldData;
        }
        return {
          ...oldData,
          pages: oldData.pages.map(page => ({
            ...page,
            piles: page.piles.map(pile =>
              pile._id === _id ? { ...pile, visibility: newVisibility } : pile
            ),
          })),
        };
      });

      return { previousCategoryData, category };
    },
    onError: (err, variables, context) => {
      if (context?.previousCategoryData && context?.category) {
        queryClient.setQueryData(["pile", context.category, ""], context.previousCategoryData);
      }
      console.log("Mutation error:", err);
    },
    onSuccess: ({ data }) => {
      console.log(data);

      const updateCache = (key) => {
        const oldData = queryClient.getQueryData(key);
        if (!oldData) return;

        const updatedPages = oldData.pages.map((page) => ({
          ...page,
          piles: page.piles.map((pile) =>
            pile._id === data._id ? { ...pile, visibility: data.visibility } : pile
          ),
        }));

        queryClient.setQueryData(key, {
          ...oldData,
          pages: updatedPages,
        });
      };

      updateCache(["pile", "all", ""]);
      updateCache(["pile", data.category, ""]);
    },
  });
};

export default useChangeVisibility;
