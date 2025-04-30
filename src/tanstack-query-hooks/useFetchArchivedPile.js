import apiClient from "../lib/axios";
import { useQuery } from "@tanstack/react-query";

const getArchivedPile = async () => {
    const response = await apiClient.get("/api/archived-pile");
    console.log(response.data); // optional debug
    return response.data;
  };
  

const useFetchArchivedPile=()=>{
    return useQuery({
        queryKey: ["archivedPile"],
        queryFn: getArchivedPile,
        // retry: (failureCount, error) => {
        //     if (error.response?.status === 404) return false;
        //     return failureCount < 10;
        // },
        // staleTime: 1000 * 60 * 5,
        // enabled:!!id
    });
    

}

export default useFetchArchivedPile 