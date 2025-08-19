import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/axios";

const getGeneratedLink = async ({ expiryOption }) => {
  const response = await apiClient.post("/api/v1/public-links", {
    expiryOption,
  });
  
  // Add timeLeft calculation to the response
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
  
  console.log(data);
  return data;
};

const useGenerateLink = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: getGeneratedLink,
    onSuccess: (data) => {
      // Update the current link query cache immediately with the new data
      queryClient.setQueryData(["currentPublicLink"], data);
      
      // Also invalidate to ensure fresh data on next fetch
      queryClient.invalidateQueries({ queryKey: ["currentPublicLink"] });
    },
  });
};

export default useGenerateLink;
