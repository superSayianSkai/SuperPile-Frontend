import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/axios";

// --- API Call ---
const verifyUser = async () => {
  const response = await apiClient.patch("/auth/first-timer");
  return response.data;
};

// --- Hook ---
export const useTimer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyUser,

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["user"] });

      // snapshot the previous user
      const prevUser = queryClient.getQueryData(["user"]);

      // optimistically update to new value
      queryClient.setQueryData(["user"], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            newTimer: true
          }
        };
      });

      return { prevUser };
    },

    onSuccess: (data) => {
      queryClient.setQueryData(["user"], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            newTimer: data.newTimer
          }
        };
      });
      
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },

    onError: (err, newTodo, context) => {
      if (context?.prevUser) {
        queryClient.setQueryData(["user"], context.prevUser);
      }
      console.error(err);
    },
  });
};
