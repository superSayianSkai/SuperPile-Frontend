import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/axios";

const changeVisibility = async ({ _id }) => {
  console.log(_id);
  try {
    const response = await apiClient.put("/api/change-visibility", { _id });
    return response.data
  } catch (error) {
    console.log(error);
  }
};

export const useChangeVisibility = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: changeVisibility,
    onError: (err) => console.log("Mutation error:", err),
    onSuccess: ({data} ) => {
      console.log("Ayotide");
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["pile"] });
    },
  });
};

export default useChangeVisibility;
