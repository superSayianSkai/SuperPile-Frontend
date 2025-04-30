import { useQuery } from "@tanstack/react-query";
import apiClient from "../lib/axios";

export const getUserPile = async ({ category }) => {
  console.log(category)
  try {
    const response = await apiClient.get(`/api/read-pile/${category}`);

    return response.data;
  } catch (error) {
    console.log(error);
    return new Error("No pile");
  }
};
const useFetchPile = ({ category }) => {
  console.log(category)
  return useQuery({
    queryKey: ["pile" ,category], 
    queryFn: () => getUserPile({ category }),
    retry: (failureCount, error) => {
      if (error.response?.status === 404) return false;
      return failureCount < 10; 
    },
    enabled: !!category,
  });
};


export default useFetchPile;
