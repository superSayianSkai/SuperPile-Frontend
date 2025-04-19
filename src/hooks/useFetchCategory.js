import apiClient from "../lib/axios";
import { useQuery } from "@tanstack/react-query";
const fetchCategory=async() => {
   const response= await apiClient.get("/api/list-of-category")
   return response 
}

export const useFetchCategory=()=>{
    return useQuery({
        queryKey:["category"],
        queryFn: fetchCategory,
        retry: (failureCount, error) => {
            if (error.status === 401) {
              return false;
            }
            return failureCount < 2;
          },
        staleTime:5*60*100
    })

}