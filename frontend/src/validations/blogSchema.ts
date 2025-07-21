import { blogCategories } from "@constants/categories";
import * as yup from "yup";

export const blogSchema = yup.object({
    thumbnail: yup.mixed<File>().required("Thumbnail is required"),
    title: yup.string()
        .trim()
        .min(3, "Title must be at least 3 characters")
        .required("Title is required"),
    subTitle: yup.string()
        .trim()
        .min(3, "SubTitle must be at least 3 characters")
        .required("SubTitle is required"),
    category: yup.mixed<typeof blogCategories[number]>()
        .oneOf(blogCategories, `Category must be one of these: ${blogCategories.join(" | ")}`)
        .required("Category is required"),
    isPublished: yup.boolean().required(),
    description: yup.string()
        .trim()
        .min(10, 'Description must be at least 10 characters')
        .required("Description is required")
});

export type BlogFormInputs = yup.InferType<typeof blogSchema>;
