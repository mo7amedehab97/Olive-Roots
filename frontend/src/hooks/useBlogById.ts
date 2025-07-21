import { blogCategories } from '@constants/categories';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@utils/axiosInstance';
import * as yup from 'yup';

const blogSchema = yup.object({
    _id: yup.string().required(),
    author: yup.object({
        _id: yup.string().required(),
        name: yup.string().required()
    }).required(),
    title: yup.string().required(),
    subTitle: yup.string().required(),
    description: yup.string().required(),
    image: yup.string().url().required(),
    category: yup.mixed<typeof blogCategories[number]>().oneOf(blogCategories).required(),
    createdAt: yup.string().required()
});

const blogResponseSchema = yup.object({
    success: yup.boolean().required(),
    message: yup.string().required(),
    data: blogSchema.required()
});

export default function useBlogById(blogId?: string) {
    return useQuery({
        queryKey: ["blog", blogId],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/v1/blogs/${blogId}`);

            try {
                await blogResponseSchema.validate(data, { abortEarly: false });
            } catch (error) {
                console.error("Response validation failed:", error);
                throw new Error("Invalid response data");
            }

            return JSON.parse(JSON.stringify(data.data));
        },
        enabled: !!blogId
    })
}
