import { useQuery } from "@tanstack/react-query";
import apiClient from "../lib/axios";

export const getUserPile = async ({ id }) => {
  console.log(id)
  try {
    const data = await apiClient.get(`/api/read-pile/${id}`);
    console.log(data)
    return data;
  } catch (error) {
    console.log(error);
    return new Error("No pile");
  }
};
const useFetchPile = ({ id }) => {
  return useQuery({
    queryKey: ["pile", id], 
    queryFn: () => getUserPile({ id }),
    retry: (failureCount, error) => {
      if (error.response?.status === 404) return false;
      return failureCount < 10; 
    },
    enabled: !!id,
  });
};


export default useFetchPile;
