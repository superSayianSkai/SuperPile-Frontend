import apiClient from "../lib/axios";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { usePostStore } from "../zustard/usePostStore";
const { setPostSuccess } = usePostStore.getState();
const postURL = async ({ url, category }) => {
  console.log(category);
  try {
    const response = await apiClient.post("/api/post-pile", { url, category });
    console.log("hey check this");
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error)
    throw  error;

  }
};

const usePostPile = () => {
  const setPostData = usePostStore((state) => state.setPostData);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postURL,

    onMutate: async ({ url, category, skipOptimisticUpdate }) => {
      if (skipOptimisticUpdate) return;

      await queryClient.cancelQueries({ queryKey: ["pile", "all", ""] });
      const previousPosts =
        queryClient.getQueryData(["pile", "all",""])?.pages?.[0]?.piles || [];

      console.log("currently listening to avatar");
      console.log(previousPosts);

      const optimisticPost = {
        _id: Date.now(),
        image: "",
        description: "",
        title: "",
        url,
        category,
      };

      const baseKey = ["pile", "all", ""];

      queryClient.setQueryData(baseKey, (oldData) => {
        const updatedData = {
          ...oldData,
          pages:
            oldData?.pages?.map((page, index) => {
              if (index === 0) {
                return {
                  ...page,
                  piles: [optimisticPost, ...page.piles],
                };
              }
              return page;
            }) || [],
          pageParams: oldData?.pageParams ?? [],
        };

        console.log("🔄 Updating cache for 'pile', 'all':", updatedData);

        return updatedData;
      });

      if (category !== "all") {
        queryClient.setQueryData(["pile", category, ""], (oldData) => ({
          ...oldData,
          pages:
            oldData?.pages?.map((page, index) => {
              if (index === 0) {
                return {
                  ...page,
                  piles: [optimisticPost, ...page.piles],
                };
              }
              return page;
            }) || [],
          pageParams: oldData?.pageParams ?? [],
        }));
      }

      return { previousPosts };
    },

    onSuccess: (data, variables) => {
      const { url, category } = variables;
      if (!data || typeof data !== "object" || !data.url) return;

      setPostData(data); // Store the posted data in Zustand
      setPostSuccess(true);

      const updateCache = (oldData) => {
        if (!oldData) return;

        const allPilesFiltered = oldData.pages.map((page) => ({
          ...page,
          piles: page.piles.filter((p) => p.url !== url),
        }));

        allPilesFiltered[0].piles.unshift(data);

        return {
          ...oldData,
          pages: allPilesFiltered,
        };
      };

      queryClient.setQueryData(["pile", "all", ""], updateCache);
      
      if (category !== "all") {
        queryClient.setQueryData(["pile", category, ""], updateCache);
      }
      console.log("i am kangchi")
      console.log(category)
      // Invalidate all pile-related queries dynamically
    queryClient.invalidateQueries({ queryKey: ["pile"], exact: false });
    },

    onError: (err, _variables, context) => {
      console.log(err);

      if (context?.previousPosts) {
        queryClient.setQueryData(["pile", "all", ""], (oldData) => ({
          ...oldData,
          pages: [
            {
              ...oldData.pages[0],
              piles: context.previousPosts,
            },
            ...oldData.pages.slice(1),
          ],
          pageParams: oldData.pageParams,
        }));
      }
    },
  });
};
export default usePostPile;
