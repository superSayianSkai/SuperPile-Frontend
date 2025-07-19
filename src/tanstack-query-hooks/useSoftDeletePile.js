import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/axios";

const softDeletePile = async ([{ _id }]) => {
  console.log(_id);
  const result = await apiClient.put("/api/soft-delete-pile", [{ _id }]);
  console.log(result);
};

const useSoftDeletePile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: softDeletePile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pile", "archivedPile"] });
    },
    onMutate: async (newPile) => {
      const id = newPile[0]._id;
      const category = newPile[0].category;
      const keyword = newPile[0].keyword;
      console.log("checking out the keyword");
      console.log(keyword);
      queryClient.invalidateQueries({ queryKey: ["pile", category] });
      console.log(id);
      console.log(category);
      await queryClient.cancelQueries({ queryKey: ["pile", "all"] });

      let previousPosts =
        queryClient.getQueryData(["pile", category])?.data ||
        queryClient.getQueryData(["pile", "all"])?.data;

      console.log(previousPosts);
      console.log(id);

      if (!previousPosts) {
        console.warn("No cached posts found.");
        return { newpile: [] };
      }

      const newpile = previousPosts.filter((post) => post._id !== id);
      const removedPile = previousPosts.filter((post) => post._id === id);

      queryClient.setQueryData(["pile", category], { data: newpile });

      queryClient.setQueryData(["pile", "all"], {
        data:
          queryClient
            .getQueryData(["pile", "all"])
            ?.data?.filter((p) => p._id !== id) || [],
      });

      queryClient.setQueryData(["archivedPile"], {
        data: removedPile,
      });

      return { newpile };
    },
    onError: (err) => {
      console.log(err);
    },
  });
};
export default useSoftDeletePile;
