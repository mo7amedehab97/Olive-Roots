import { z } from "zod";

export const registerSchema = z.object({
    name: z.string({
        required_error: "Name is required"
    }).trim()
        .nonempty("Name is required")
        .min(3, "Name must be at least 3 characters"),

    email: z.string({
        required_error: "Email is required"
    }).trim()
        .nonempty("Email is required")
        .email("Invalid email format"),

    password: z.string({
        required_error: "Password is required"
    }).trim()
        .nonempty("Password is required")
        .min(6, "Password must be at least 6 characters")
});

export type RegisterFormInputs = z.infer<typeof registerSchema>; 