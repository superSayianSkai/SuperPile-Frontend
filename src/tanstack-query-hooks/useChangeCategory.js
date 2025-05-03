import { useMutation } from "@tanstack/react-query";
import apiClient from "../lib/axios";
import { useQueryClient } from "@tanstack/react-query";
const changeCategory = async ({ _id, category }) => {
  const response = await apiClient.post("/api/change-pile-category", {
    _id,
    category,
  });
  console.log(response);
  return response.data;
};

const useChangeCategory = () => {
  const queryClient = useQueryClient();
  console.log("yeheheh");
  return useMutation({
    mutationFn: changeCategory,
    onSuccess: ({category}) => {
      queryClient.invalidateQueries(["pile", category]);
    },
    onMutate: ({ _id, category }) => {
      console.log(category);
      console.log(_id);
      const previousPosts = queryClient.getQueryData(["pile", "all"]);
      console.log("hey something is going on");
      console.log(previousPosts);
      const newpile = previousPosts.data.filter((post) => post._id !== _id);
      const removedPile = previousPosts.data.filter((post) => post._id === _id);
      console.log(newpile);
      console.log(removedPile);
      queryClient.setQueryData(["pile", category], (old) => ({
        data: [...(old?.data || []),...removedPile],
      }));
    },
    onError: (error) => {
      console.log(error);
    },
    //perfrom optimistical update on changing category
  });
};

export default useChangeCategory;
