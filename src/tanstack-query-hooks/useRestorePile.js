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
        onMutate: async ({ _id, category = "uncategorized" }) => {
            await queryClient.cancelQueries(["pile", "all"]);
            const archivedData = queryClient.getQueryData(["archivedPile"]);
            // Infinite query shape: { pages: [{ piles: [...] }, ...], ... }
            const previousPosts = archivedData?.pages?.[0]?.piles || [];
            const removedPile = previousPosts.find((post) => post._id === _id);
            if (!removedPile) return;

            // Update 'archivedPile'
            queryClient.setQueryData(["archivedPile"], (old) => ({
                ...old,
                pages: old.pages.map((page, index) => {
                    if (index === 0) {
                        return {
                            ...page,
                            piles: page.piles.filter((p) => p._id !== _id),
                        };
                    }
                    return page;
                }),
            }));

            // Update 'pile'
            queryClient.setQueryData(["pile", "all"], (old) => ({
                ...old,
                data: [...(old?.data || []), removedPile],
            }));

            if (category !== "all") {
                queryClient.setQueryData(["pile", category], (old) => ({
                    ...old,
                    data: [...(old?.data || []), removedPile],
                }));
            }

            return { newpile: previousPosts.filter((previousPile) => _id !== previousPile._id) };
        },
          onError: (err) => {
            console.log(err);
          },
    })
}

export default useRestorePile