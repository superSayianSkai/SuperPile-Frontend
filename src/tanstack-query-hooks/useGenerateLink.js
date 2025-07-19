import { useMutation } from "@tanstack/react-query";
import apiClient from "../lib/axios";

const getGeneratedLink = async () => {
  const response = await apiClient.get("/api/generate-public-link");
  console.log(response.data);
  return response.data;
};

const useGenrateLink = () => {
  return useMutation({
    mutationFn: getGeneratedLink,
  });
};

export default useGenrateLink;
