import { useQuery } from "@tanstack/react-query";
import apiClient from "../lib/axios";

export const getUserPublicPile = async ({ publicLinkToken}) => {
  try {
    const response = await apiClient.get(`/share/${publicLinkToken}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const useFetchUserPublicPile = (publicLinkToken) => {
  return useQuery({
    queryKey: ["pub1lcPile", publicLinkToken],
    queryFn: () => getUserPublicPile({ publicLinkToken }),
    enabled: !!publicLinkToken, 
    retry: false,
  });
};

export default useFetchUserPublicPile;
