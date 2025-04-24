import { useMutation } from "@tanstack/react-query";
import apiClient from "../lib/axios";
import { useQueryClient } from "@tanstack/react-query";
const changeCategory=async({_id,category})=>{
    const response = await apiClient.post("/api/change-pile-category",{_id,category})
    console.log(response)
    return response
}

const useChangeCategory=()=>{
    const queryClient=useQueryClient()
    return useMutation({
        mutationFn:changeCategory,
        onSuccess: () => {
            queryClient.invalidateQueries(["pile"]);
          },
    })
}

export default useChangeCategory