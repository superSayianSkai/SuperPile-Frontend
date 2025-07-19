import apiClient from "../lib/axios";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

const postURL = async ({url,category}) => {
  console.log(category)
    try {
    const response = await apiClient.post("/api/post-pile", { url,category });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const usePostPile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postURL,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:["pile"]});
    },

    onMutate: async ({url, category}) => {
      console.log(category)
      await queryClient.cancelQueries({ queryKey: ["pile", "all"] });
      const previousPosts = queryClient.getQueryData(["pile", "all"])?.data || [];
      console.log(previousPosts)
      queryClient.setQueryData(["pile", "all"], {
          data: [
            ...previousPosts,
            {
              _id: Date.now(),
              image: "",
              description: "",
              title: "",
              url: url,
              category:category
            },
          ],
      
      });
      return { previousPosts};
    },
    onError: (err) => {
      console.log(err);
    },
  });
};
export default usePostPile;
