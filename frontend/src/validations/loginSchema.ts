import * as yup from "yup";

export const loginSchema = yup.object({
    email: yup.string()
        .trim()
        .required("Email is required")
        .email("Invalid email address"),
    password: yup.string()
        .trim()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
});

export type LoginFormInputs = yup.InferType<typeof loginSchema>;
