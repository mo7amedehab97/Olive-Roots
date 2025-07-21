import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@utils/axiosInstance";
import * as yup from "yup";

const commentSchema = yup.object({
    _id: yup.string().required(),
    name: yup.string().required(),
    content: yup.string().required(),
    createdAt: yup.string().required(),
    updatedAt: yup.string().required()
});

const approvedCommentsResponseSchema = yup.object({
    success: yup.boolean().required(),
    message: yup.string().required(),
    data: yup.array(commentSchema).required()
});

export type Comment = yup.InferType<typeof commentSchema>;

export default function useApprovedComments(blogId?: string) {
    return useQuery({
        queryKey: ["approvedComments", blogId],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/v1/comments/blog/${blogId}`);
            try {
                await approvedCommentsResponseSchema.validate(data, { abortEarly: false });
            } catch (error) {
                console.error("Response validation failed:", error);
                throw new Error("Invalid response format");
            }
            return JSON.parse(JSON.stringify(data.data));
        },
        enabled: !!blogId
    })
}
