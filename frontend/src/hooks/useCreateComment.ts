import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@utils/axiosInstance";
import * as yup from "yup";

const commentResponseSchema = yup.object({
    success: yup.boolean().required(),
    message: yup.string().required()
});

type CreateCommentInput = {
    name: string,
    content: string
}

export default function useCreateComment(blogId?: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["createComment", blogId],
        mutationFn: async (commentData: CreateCommentInput) => {
            if (!blogId) throw new Error("Blog ID is required");
            const { data } = await axiosInstance.post(`/v1/comments/${blogId}`, commentData);
            try {
                await commentResponseSchema.validate(data, { abortEarly: false });
                return JSON.parse(JSON.stringify(data));
            } catch (error) {
                console.error('Invalid comment response:', error);
                throw new Error('Invalid response data');
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
            queryClient.invalidateQueries({ queryKey: ["adminComments"], exact: false })
        }
    })
}
