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
      await queryClient.cancelQueries({queryKey:["archivedPile"]});
      const previousData = queryClient.getQueryData(["archivedPile"]);
      const previousPages = previousData?.pages || [];
      const newPages = previousPages.map(page => ({
        ...page,
        piles: page.piles.filter(pile => pile._id !== _id)
      }));
      queryClient.setQueryData(["archivedPile"], {
        ...previousData,
        pages: newPages
      });
      return { newPages };
    },
  });
};


export default useHardDeletePile;
