import { useInfiniteQuery } from "@tanstack/react-query";
import apiClient from "../lib/axios";

export const getUserPile = async ({ lastId = null, category = "all", keyword = "" }) => {
  let URL = `/api/v1/piles?limit=18`;
  
  // Add category as a query parameter if it's not "all"
  if (category && category !== "all") {
    URL += `&category=${category}`;
  }
  
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

    // Keep previous data while fetching new data
    keepPreviousData: true,
    
    // Custom error handling for offline scenarios
    retry: (failureCount, error) => {
      if (error?.response?.status === 404) return false;
      // Don't retry on network errors (offline)
      if (!navigator.onLine) return false;
      return failureCount < 3;
    },

    // Only refetch when online
    refetchOnMount: true,
    refetchOnWindowFocus:true,
    
    // Enable background refetch when connection is restored
    refetchOnReconnect: true,
  });
};

export default useFetchPile;