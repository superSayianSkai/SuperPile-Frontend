import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/axios";

const softDeletePile = async ([{ _id }]) => {
  return await apiClient.put("/api/soft-delete-pile", [{ _id }]);
};

const useSoftDeletePile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: softDeletePile,

    onMutate: async (pileInfo) => {
      const { _id, category, keyword } = pileInfo[0];
      const queryKey = ["pile", category, keyword ?? ""];

      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData(queryKey);
      let updatedPages = previousData?.pages ?? [];

      if (updatedPages.length > 0) {
        updatedPages = updatedPages.map((page) => ({
          ...page,
          piles: page.piles.filter((pile) => pile._id !== _id),
        }));

        queryClient.setQueryData(queryKey, {
          ...previousData,
          pages: updatedPages,
        });
      }

      // 🔁 Also update the "pile", "all", "" view for immediate UI consistency
      if (category !== "all") {
        const allKey = ["pile", "all", ""];
        const allData = queryClient.getQueryData(allKey);

        if (allData?.pages) {
          const allPages = allData.pages.map((page) => ({
            ...page,
            piles: page.piles.filter((pile) => pile._id !== _id),
          }));

          queryClient.setQueryData(allKey, {
            ...allData,
            pages: allPages,
          });
        }
      }

      return { previousData, queryKey };
    },

    onError: (error, _, context) => {
      if (context?.previousData && context?.queryKey) {
        queryClient.setQueryData(context.queryKey, context.previousData);
      }
      console.error("❌ Soft delete failed:", error);
    },

    onSuccess: (_, pileInfo) => {
      const removed = pileInfo[0];
      const archivedKey = ["archivedPile"];
      const existing = queryClient.getQueryData(archivedKey) ?? { pages: [], pageParams: [] };

      const newFirstPage = {
        piles: [removed, ...(existing.pages?.[0]?.piles || [])],
      };

      queryClient.setQueryData(archivedKey, {
        ...existing,
        pages: [newFirstPage, ...(existing.pages?.slice(1) || [])],
        pageParams: existing.pageParams || [],
      });

      queryClient.invalidateQueries({
        queryKey: ["pile", removed.category, removed.keyword ?? ""],
      });
    },
  });
};

export default useSoftDeletePile;