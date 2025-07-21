import axiosInstance from "@utils/axiosInstance";
import { useAuth } from "./useAuth";
import * as yup from "yup";

const refreshResponseSchema = yup.object({
    user: yup.object({
        id: yup.string().required(),
        name: yup.string().required(),
        email: yup.string().email().required()
    }).required(),
    accessToken: yup.string().required()
});

export default function useRefresh() {
    const { login } = useAuth();

    const refresh = async (): Promise<string | null> => {
        try {
            const { data } = await axiosInstance.post("/v1/auth/refresh-token");
            try {
                await refreshResponseSchema.validate(data, { abortEarly: false });
            } catch (error) {
                console.error("Validation failed:", error);
                return null;
            }
            const validationData = JSON.parse(JSON.stringify(data));
            login({
                user: validationData.user,
                accessToken: validationData.accessToken
            });
            return validationData.accessToken;
        } catch (err) {
            console.error("Request failed:", err);
            return null;
        }
    }
    return refresh;
}