import apiClient from "../lib/axios";
// import { useMutation } from "@tanstack/react-query";

export const fetchCickedCategory=async({_id}) => {
    console.log(_id)
    const response = await apiClient.post("/api/get-clicked-pile", {_id})
    console.log(response)
   return response.data 
}

// export const useFetchClickedCategory=()=>{
//     return useMutation({
//         mutationFn:fetchCickedCategory,
//         onSuccess:(data)=>{
//             return data
//         },
//         onError:(error)=>{
//             console.log(error)
//         }
//     })
// }