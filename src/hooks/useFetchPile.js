import { useQuery } from "@tanstack/react-query";
import apiClient from "../lib/axios";

export const getUserPile = async ({ id }) => {
  try {
    const data = await apiClient.get(`/api/read-pile/${id}`);
    return data;
  } catch (error) {
    console.log(error);
    return new Error("No pile");
  }
};

const useFetchPile = ({ id }) => {
  return useQuery({
    queryKey: ["pile"],
    queryFn: () => getUserPile({ id }),
    retry: (failureCount, error) => {
      if (error.response?.status === 404) return false; // don't retry on permanent errors
      return failureCount < 10; // try 10 times max
    },
  });
};

export default useFetchPile;
