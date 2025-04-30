import { useMutation } from "@tanstack/react-query";
import apiClient from "../lib/axios";
import { useQueryClient } from "@tanstack/react-query";
const changeCategory=async({_id,category})=>{
    const response = await apiClient.post("/api/change-pile-category",{_id,category})
    console.log(response)
    return response.data
}

const useChangeCategory=()=>{
    const queryClient=useQueryClient()
    console.log("yeheheh")
    return useMutation({
        mutationFn:changeCategory,
        onSuccess: () => {
            queryClient.invalidateQueries(["pile", "all"]);
          },
          onMutate:({category})=>{
            console.log(category)
            queryClient.cancelQueries["pile",category]
          }
        
    })
}

export default useChangeCategory