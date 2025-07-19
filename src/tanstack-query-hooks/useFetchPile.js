import { useInfiniteQuery } from "@tanstack/react-query";
import apiClient from "../lib/axios";
export const getUserPile = async ({ pageParam, category, keyword }) => {
  console.log("📦 Keyword:", keyword);
  console.log("📁 Category:", category);
  console.log("📄 Page param:", pageParam);

  const URL = keyword
    ? `/api/read-pile/${category}?keyword=${keyword}&page=${pageParam}&limit=10`
    : `/api/read-pile/${category}?page=${pageParam}&limit=18`;

  try {
    const response = await apiClient.get(URL);

    console.log("🔄 Response:", response.data);
    console.log("✅ Piles:", response.data.data.piles);

    // ✅ FIX: Extract from .data.data
    const { piles, hasMore } = response.data.data;

    return {
      piles,
      nextPage: hasMore ? pageParam + 1 : undefined,
    };
  } catch (error) {
    console.error("❌ Error fetching piles:", error);
    throw new Error("No pile");
  }
};

const useFetchPile = ({ category, keyword }) => {
  console.log(category);
  console.log(keyword);
  return useInfiniteQuery({
    // Update the queryKey to include `keyword` as well
    queryKey: keyword ? ["pile", category, keyword] : ["pile", category], // Conditionally add keyword to query key
    queryFn: ({ pageParam = 1 }) => {
      console.log("🚀 Fetching page:", pageParam);
      console.log("📦 Category:", category);
      console.log("🔎 Keyword:", keyword);

      return getUserPile({ pageParam, category, keyword });
    }, // Pass keyword to the fetching function
    getNextPageParam: (lastPage) => lastPage.nextPage,
    retry: (failureCount, error) => {
      if (error.response?.status === 404) return false;
      return failureCount < 10;
    },
    enabled: !!category, // Ensure the query only runs when `category` is available
  });
};

export default useFetchPile;
