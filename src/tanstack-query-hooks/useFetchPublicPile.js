import { useQuery } from "@tanstack/react-query";
import apiClient from "../lib/axios";

export const getUserPublicPile = async ({ uuID }) => {
  try {
    const response = await apiClient.get(`/share/${uuID}`);
    return response.data;
  } catch (error) {
    console.log(error);
    return new Error("No pile");
  }
};

const useFetchUserPublicPile = (uuID) => {
  return useQuery({
    queryKey: ["pub1lcPile", uuID],
    queryFn: () => getUserPublicPile({ uuID }),
    enabled: !!uuID, 
    retry: (failureCount, error) => {
      if (error.response?.status === 404) return false;
      return failureCount < 10;
    },
  });
};

export default useFetchUserPublicPile;
