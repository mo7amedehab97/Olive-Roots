import useAxios from './useAxios'
import { useMutation, useQueryClient } from '@tanstack/react-query';


export default function useApproveComment() {
    const axios = useAxios();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["approveComment"],
        mutationFn: async (commentId: string) => {
            const { data } = await axios.patch(`/v1/comments/${commentId}/approve`);
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["adminComments"], exact: false });
            queryClient.invalidateQueries({ queryKey: ["approvedComments", data.blogId] });
        },
        onError: (error) => {
            console.error("Failed to approve comment:", error);
        }
    })
}
