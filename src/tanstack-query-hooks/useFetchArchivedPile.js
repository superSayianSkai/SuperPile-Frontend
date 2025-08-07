import apiClient from "../lib/axios";
import { useInfiniteQuery } from "@tanstack/react-query";

const getArchivedPile = async ({ lastId = null }) => {
  try {
    const response = await apiClient.get(
      `/api/archived-pile?limit=18&lastId=${lastId}`
    );
    const { piles = [], hasMore, newLastId } = response.data.data;
    console.log(response.data);
    return {
      piles,
      hasMore,
      lastId: newLastId,
    };
  } catch (error) {
    console.error("Error fetching archived pile:", error?.response?.data?.message || error.message || error);
    throw new Error(error?.response?.data?.message || "Failed to fetch archived piles.");
  }
};

const useFetchArchivedPile = () => {
  return useInfiniteQuery({
    queryKey: ["archivedPile"],
    queryFn: ({ pageParam = null }) => getArchivedPile({ lastId: pageParam }),
    getNextPageParam: (lastPage) => {
      if (!lastPage || typeof lastPage !== "object") return undefined;

      const hasMore = lastPage.hasMore ?? false;
      const lastId = lastPage.lastId ?? null;

      return hasMore && lastId ? lastId : undefined;
    },
    retry:false
  });
};

export default useFetchArchivedPile;
