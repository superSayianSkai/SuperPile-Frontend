import apiClient from "../lib/axios";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

const postURL = async (url) => {
  console.log(url);
  try {
    const response = await apiClient.post("/api/post-pile", { url });
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const usePostPile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postURL,
    onSuccess: () => {
      queryClient.invalidateQueries(["pile"]);
    },

    onMutate: async (newPost) => {
      await queryClient.cancelQueries({ queryKey: ["pile"] });
      const previousPosts = queryClient.getQueryData(["pile"])?.data.data || [];
      queryClient.setQueryData(["pile"], {
        data: {
          data: [
            ...previousPosts,
            {
              _id: Date.now(),
              image: "",
              description: "",
              title: "",
              url: newPost,
            },
          ],
        },
      });
      return { previousPosts,newPost };
    },
    onError: (err) => {
      console.log(err);
    },
  });
};
export default usePostPile;
