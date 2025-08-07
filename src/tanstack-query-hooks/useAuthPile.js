import { useQuery } from "@tanstack/react-query";
import apiClient from "../lib/axios";
import { useAuthStore } from "../zustard/useAuthStore";

const getUserAuthorised = async () => {
  const response = await apiClient.get("/auth/me");
  return response.data;
};

const useAuth = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);
  const setError = useAuthStore((state) => state.setError);

  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      setLoading(true);
      try {
        const data = await getUserAuthorised();
        setUser(data);
        setLoading(false);
        setError(false, null);
        return data;
      } catch (error) {
        setLoading(false);
        setError(true, error);
        throw error;
      }
    },
    retry: (failureCount, error) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 2;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export default useAuth;
