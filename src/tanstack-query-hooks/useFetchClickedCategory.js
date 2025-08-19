import apiClient from "../lib/axios";
// import { useMutation } from "@tanstack/react-query";

export const fetchCickedCategory = async ({ _id }) => {
  console.log(_id);
  console.log("i clicked here");
  const response = await apiClient.get(`/api/v1/piles/${_id}`);
  console.log(response);
  return response.data;
};

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
