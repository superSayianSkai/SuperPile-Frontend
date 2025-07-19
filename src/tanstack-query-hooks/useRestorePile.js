import { useMutation, useQueryClient } from "@tanstack/react-query"
import apiClient from "../lib/axios"

export const restore=async({_id}) =>{
    console.log(_id)
    const response= await apiClient.put("/api/restore-pile", {_id})
    console.log(response.data)
}

const useRestorePile =()=>{
    const queryClient= useQueryClient()
    return useMutation({
        mutationFn:restore,
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["pile" ,"all"]})
        },
        onMutate: async ({_id, category}) => {
            console.log(category)
            await queryClient.cancelQueries(["pile","all"]);
            const previousPosts = queryClient.getQueryData(["archivedPile"]).data;
            console.log(previousPosts)
            console.log(_id)
            const newpile = previousPosts.filter((previousPile) => _id!= previousPile._id);
            const removedPile = previousPosts.filter((post) => post._id === _id);
            console.log(newpile)
            console.log(removedPile)

            console.log("i love you")
            // console.log(removedPile)

            if(category=="all"){
                queryClient.setQueryData(["pile","all"], old => ({
                  data: [...(old?.data || []), removedPile[0]]
                }));
            }else{
                queryClient.setQueryData(["pile","all"], old => ({
                    data: [...(old?.data || []), removedPile[0]]
                  }));
                queryClient.setQueryData(["pile", category], old => ({
                    data: [...(old?.data || []), removedPile[0]]
                  }));
                  
            }
            
            queryClient.setQueryData(["archivedPile"],{
                  data:[
                  ...newpile
                  ]
            })
           return {newpile}
          },
          onError: (err) => {
            console.log(err);
          },
    })
}

export default useRestorePile