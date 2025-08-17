import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/axios";

const getGeneratedLink = async ({ expiryOption }) => {
  const response = await apiClient.post("/api/generate-public-link", {
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
    onSuccess: () => {
      // Invalidate and refetch the current link query after a short delay
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["currentPublicLink"] });
      }, 500);
    },
  });
};

export default useGenerateLink;
