import type { AxiosInstance } from "axios";
import * as yup from "yup";
import useAxios from "./useAxios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const blogSchema = yup.object({
    _id: yup.string().required(),
    title: yup.string().required(),
    isPublished: yup.boolean().required(),
    createdAt: yup.string().required(),
});

const paginationSchema = yup.object({
    currentPage: yup.number().required(),
    totalPages: yup.number().required(),
    hasNextPage: yup.boolean().required(),
    hasPrevPage: yup.boolean().required(),
});

const authorBlogsResponseSchema = yup.object({
    success: yup.boolean().required(),
    message: yup.string().required(),
    data: yup.array(blogSchema).required(),
    pagination: paginationSchema.required(),
});

export async function fetchAuthorBlogs(axiosInstance: AxiosInstance, page = 1) {
    const { data } = await axiosInstance.get("/v1/blogs/author", {
        params: { page },
    });
    try {
        await authorBlogsResponseSchema.validate(data, { abortEarly: false });
    } catch (error) {
        console.error("Response validation failed:", error);
        throw new Error("Invalid author blogs data");
    }
    return {
        blogs: JSON.parse(JSON.stringify(data.data)),
        pagination: JSON.parse(JSON.stringify(data.pagination))
    };
}

export default function useAuthorBlogs(page = 1) {
    const axios = useAxios();
    return useQuery({
        queryKey: ["authorBlogs", page],
        queryFn: () => fetchAuthorBlogs(axios, page),
        placeholderData: keepPreviousData
    });
}