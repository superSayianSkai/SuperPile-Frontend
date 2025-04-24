import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/axios";

const softDeletePile = async ([{ _id, category }]) => {
  console.log(_id);
  const result = await apiClient.put("/api/soft-delete-pile", [{ _id }]);
  console.log(result);
};

const useSoftDeletePile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: softDeletePile,
    onSuccess: () => {
      queryClient.invalidateQueries(["pile"]);
    },
    onMutate: async (newId) => {
      await queryClient.cancelQueries({ queryKey: ["pile"] });
      const previousPiles = queryClient.getQueryData(["pile"])?.data.data || [];
      const id=(newId[0])._id
      console.log(id)
      const newpile = previousPiles.filter(
        (previousPiles) => id != previousPiles._id
      );
      console.log(newpile)
      queryClient.setQueryData(["pile"],{
        data:{
            data:[
            ...newpile
            ]
        }
        
      })
     return {newpile}
    },
  });
};
export default useSoftDeletePile;
