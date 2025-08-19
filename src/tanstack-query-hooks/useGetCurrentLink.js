import { useQuery } from "@tanstack/react-query";
import apiClient from "../lib/axios";

const getCurrentLink = async () => {
  const response = await apiClient.get("/api/v1/public-links");
  
  // Add timeLeft calculation to the response, similar to useGenerateLink
  const data = response.data;
  if (data.success && data.expiresAt) {
      const now = Date.now();
    const timeLeft = data.expiresAt - now;
    data.timeLeft = {
      total: timeLeft,
      minutes: Math.floor(timeLeft / (1000 * 60)),
      seconds: Math.floor((timeLeft % (1000 * 60)) / 1000)
    };
  }
  
  return data;
};

const useGetCurrentLink = () => {
  return useQuery({
    queryKey: ["currentPublicLink"],
    queryFn: getCurrentLink,
    retry: false, // Don't retry if no link exists (404)
    refetchInterval: (data) => {
      // Only refetch every second if there's an active link with time left
      if (data?.success && data?.timeLeft?.total > 0) {
        return 1000; // Refetch every second for countdown
      }
      return false; // Stop refetching if no active link
    },
    staleTime: 0, // Always consider data stale so it refetches when needed
  });
};

export default useGetCurrentLink;