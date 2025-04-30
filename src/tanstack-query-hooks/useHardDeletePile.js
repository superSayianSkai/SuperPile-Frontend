import { useMutation} from "@tanstack/react-query";
import apiClient from "../lib/axios";
import { useQueryClient } from "@tanstack/react-query";

export const deleteUserPile = async ({ _id }) => {
  console.log("hey love")
  console.log({_id})
  try {
    const data = await apiClient.put(`/api/hard-delete-pile`, {_id});
    console.log(data)
    return data;
  } catch (error) {
    console.log(error);
    return new Error("No pile");
  }
};
const useHardDeletePile = () => {
    const queryClient= useQueryClient()
  return useMutation({
    mutationFn:deleteUserPile,
     onSuccess:() => {
      queryClient.invalidateQueries(["archivedPile"])
    },
     onMutate: async ({_id}) => {
      console.log("heheheh")
      console.log(_id )
      await queryClient.cancelQueries(["archivedPile"]);
      const previousPosts = queryClient.getQueryData(["archivedPile"]).data;
      console.log(previousPosts)
      const newpile = previousPosts.filter((previousPile) => _id!= previousPile._id);
      console.log("i love you")
      console.log(newpile)
      queryClient.setQueryData(["archivedPile"],{
            data:[
            ...newpile
            ]
      })
     return {newpile}
    },
  });
};


export default useHardDeletePile;
