import { blogCategories, type BlogCategory } from '@constants/categories';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import axiosInstance from '@utils/axiosInstance';
import * as yup from "yup";

const blogSchema = yup.object({
    _id: yup.string().required(),
    title: yup.string().required(),
    description: yup.string().required(),
    category: yup.mixed<typeof blogCategories[number]>().oneOf(blogCategories).required(),
    image: yup.string().url().required()
});

const paginationSchema = yup.object({
    currentPage: yup.number().required(),
    totalPages: yup.number().required(),
    hasNextPage: yup.boolean().required(),
    hasPrevPage: yup.boolean().required()
});

const blogsResponseSchema = yup.object({
    success: yup.boolean().required(),
    message: yup.string().required(),
    data: yup.array(blogSchema).required(),
    pagination: paginationSchema.required()
});

export type BlogCategoryFilter = "all" | BlogCategory;

type UseBlogsByCategoryParams = {
    category: BlogCategoryFilter;
    page?: number;
    q?: string
}

export async function fetchBlogsByCategory(category: BlogCategoryFilter, page = 1, q = "") {
    const { data } = await axiosInstance.get(`/v1/blogs/category/${category}`, {
        params: { page, q }
    });
    try {
        await blogsResponseSchema.validate(data, { abortEarly: false });
    } catch (error) {
        console.error("Response validation failed:", error);
        throw new Error("Invalid response data");
    }
    return {
        blogs: JSON.parse(JSON.stringify(data.data)),
        pagination: JSON.parse(JSON.stringify(data.pagination))
    };
}

export type Blog = yup.InferType<typeof blogSchema>;

export default function useBlogsByCategory({ category, page = 1, q }: UseBlogsByCategoryParams) {
    return useQuery({
        queryKey: ["blogs", category, page, q],
        queryFn: () => fetchBlogsByCategory(category, page, q),
        placeholderData: keepPreviousData,
        enabled: !!category
    })
}
