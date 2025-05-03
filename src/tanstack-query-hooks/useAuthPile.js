import { useQuery } from "@tanstack/react-query";
import apiClient from "../lib/axios";

const getUserAuthorised = async () => {
  try {
    const response = await apiClient.get("/auth/me");
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Unauthorized");
  }
};
const useAuth = () => {
  return useQuery({
    queryKey: ["user"],
    refetchOnMount:false,
    queryFn: getUserAuthorised,
    retry: (failureCount, error) => {
      if (error.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export default useAuth;
