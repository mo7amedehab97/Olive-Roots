import { useQuery } from '@tanstack/react-query';
import useAxios from './useAxios';
import * as yup from 'yup';

const blogSchema = yup.object({
    _id: yup.string().required(),
    title: yup.string().required(),
    isPublished: yup.boolean().required(),
    createdAt: yup.string().required()
});

const dashboardStatsSchema = yup.object({
    success: yup.boolean().required(),
    message: yup.string().required(),
    data: yup.object({
        totalBlogs: yup.number().required(),
        totalComments: yup.number().required(),
        totalDrafts: yup.number().required(),
        latestBlogs: yup.array(blogSchema).required()
    }).required()
});

export type Blog = yup.InferType<typeof blogSchema>;

export default function useDashboardStats() {
    const axios = useAxios();
    return useQuery({
        queryKey: ["dashboardStats"],
        queryFn: async () => {
            const { data } = await axios.get("/v1/blogs/dashboard");
            try {
                await dashboardStatsSchema.validate(data, { abortEarly: false });
                return JSON.parse(JSON.stringify(data.data));
            } catch (error) {
                console.error("Dashboard stats response invalid", error);
                throw new Error("Invalid dashboard data");
            }
        }
    })
}
