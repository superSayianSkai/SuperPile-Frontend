import { useInfiniteQuery } from "@tanstack/react-query";
import apiClient from "../lib/axios";

export const getUserPile = async ({ lastId = null, category = "all", keyword = "" }) => {
  let URL = `/api/read-pile/${category}?limit=18`;
  if (keyword) URL += `&keyword=${keyword}`;
  if (lastId) URL += `&lastId=${lastId}`;

  try {
    const response = await apiClient.get(URL);

    const { piles = [], hasMore, newLastId } = response?.data?.data||{};

    return {
      piles,
      hasMore,
      lastId: newLastId,
    };
  } catch (error) {
    console.error(error);
    throw new Error("No pile");
  }
};

const useFetchPile = ({ category, keyword }) => {
  return useInfiniteQuery({
    queryKey: ["pile", category, keyword ?? ""],

    queryFn: ({ pageParam = null }) =>
      getUserPile({ lastId: pageParam, category, keyword }),

    getNextPageParam: (lastPage) => {
      return lastPage?.hasMore ? lastPage.lastId : undefined;
    },

    retry: (failureCount, error) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 10;
    },

    enabled: Boolean(category),
    keepPreviousData: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
};

export default useFetchPile;