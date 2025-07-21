import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "./useAxios";
import type { BlogFormInputs } from "@validations/blogSchema";
import * as yup from "yup";
import { blogCategories } from "@constants/categories";

const CreateBlogResponse = yup.object({
    success: yup.boolean().required(),
    message: yup.string().required(),
    data: yup.object({
        _id: yup.string().required(),
        category: yup.mixed<typeof blogCategories[number]>().oneOf(blogCategories).required()
    }).required()
});

export default function useCreateBlog() {
    const axios = useAxios();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["createBlog"],
        mutationFn: async (blogData: BlogFormInputs) => {
            const formData = new FormData();
            formData.append("image", blogData.thumbnail);
            formData.append("title", blogData.title);
            formData.append("subTitle", blogData.subTitle);
            formData.append("description", blogData.description);
            formData.append("category", blogData.category);
            formData.append("isPublished", blogData.isPublished.toString());

            const { data } = await axios.post("/v1/blogs", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            try {
                await CreateBlogResponse.validate(data, { abortEarly: false });
            } catch (error) {
                console.error("Invalid blog creation response:", error);
                throw new Error("Invalid response from server.");
            }

            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
            queryClient.invalidateQueries({ queryKey: ["blogs", "all"], exact: false });
            queryClient.invalidateQueries({ queryKey: ["blogs", data.data.category], exact: false });
            queryClient.invalidateQueries({ queryKey: ["authorBlogs"], exact: false });
        }
    })
}
