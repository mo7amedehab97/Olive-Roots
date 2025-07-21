import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAxios from './useAxios';


export default function useDeleteComment() {
    const axios = useAxios();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["deleteComment"],
        mutationFn: async (commentId: string) => {
            const { data } = await axios.delete(`/v1/comments/${commentId}`);
            return data;
        },
        onSuccess: (data) => {
            if (data.isApproved) {
                queryClient.invalidateQueries({ queryKey: ["adminComments", true], exact: false });
                queryClient.invalidateQueries({ queryKey: ["approvedComments", data.blogId] });
            } else {
                queryClient.invalidateQueries({ queryKey: ["adminComments", false], exact: false })
            }
        },
        onError: (err) => {
            console.error("Failed to delete the comment:", err);
        }
    })
}
