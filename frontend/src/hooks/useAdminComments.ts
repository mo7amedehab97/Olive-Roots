import type { AxiosInstance } from 'axios';
import useAxios from './useAxios';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import * as yup from 'yup';

const commentSchema = yup.object({
    _id: yup.string().required(),
    blog: yup.object({
        _id: yup.string().required(),
        title: yup.string().required()
    }).required(),
    name: yup.string().required(),
    content: yup.string().required(),
    isApproved: yup.boolean().required(),
    createdAt: yup.string().required()
});

const paginationSchema = yup.object({
    currentPage: yup.number().required(),
    totalPages: yup.number().required(),
    hasNextPage: yup.boolean().required(),
    hasPrevPage: yup.boolean().required()
});

const commentsResponseSchema = yup.object({
    success: yup.boolean().required(),
    message: yup.string().required(),
    data: yup.array(commentSchema).required(),
    pagination: paginationSchema.required()
});

export type Comment = yup.InferType<typeof commentSchema>;

type AdminCommentsParams = {
    isApproved?: boolean;
    page?: number
}

export async function fetchAdminComments(axiosInstance: AxiosInstance, { isApproved = true, page = 1 }: AdminCommentsParams = {}) {
    const { data } = await axiosInstance.get("/v1/comments", {
        params: { isApproved, page }
    })
    try {
        await commentsResponseSchema.validate(data, { abortEarly: false });
    } catch (error) {
        console.error("Admin comments response validation failed:", error);
        throw new Error("Invalid admin comments data");
    }
    return {
        comments: JSON.parse(JSON.stringify(data.data)),
        pagination: JSON.parse(JSON.stringify(data.pagination))
    }
}

export default function useAdminComments(params: AdminCommentsParams = {}) {
    const { isApproved = true, page = 1 } = params;
    const axios = useAxios();
    return useQuery({
        queryKey: ["adminComments", isApproved, page],
        queryFn: () => fetchAdminComments(axios, { isApproved, page }),
        placeholderData: keepPreviousData
    })
}
