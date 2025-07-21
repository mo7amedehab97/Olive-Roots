import * as yup from "yup";

export const createCommentSchema = yup.object({
    name: yup.string()
        .trim()
        .required("Name is required")
        .min(3, "Name must be at least 3 characters")
        .max(30, "Name must be at most 30 characters"),
    content: yup.string()
        .trim()
        .required("Content is required")
        .min(3, "Content must be at least 3 characters")
        .max(1000, "Content must be at most 1000 characters")
});

export type CommentInputs = yup.InferType<typeof createCommentSchema>;