import * as yup from "yup";

export const registerSchema = yup.object({
    name: yup.string()
        .trim()
        .required("Name is required")
        .min(3, "Name must be at least 3 characters"),
    email: yup.string()
        .trim()
        .required("Email is required")
        .email("Invalid email format"),
    password: yup.string()
        .trim()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters")
});

export type RegisterFormInputs = yup.InferType<typeof registerSchema>;