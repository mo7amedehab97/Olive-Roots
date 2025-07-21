import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@utils/axiosInstance';
import * as yup from 'yup';

interface SubscribeInput {
    email: string;
}

const subscribeResponseSchema = yup.object({
    success: yup.boolean().required(),
    message: yup.string().required()
});

export default function useSubscribeNewsletter() {
    return useMutation({
        mutationKey: ["subscribeToNewsletter"],
        mutationFn: async (input: SubscribeInput) => {
            const { data } = await axiosInstance.post("/v1/newsletter/subscribe", input);

            // Validate response using yup
            try {
                await subscribeResponseSchema.validate(data, { abortEarly: false });
            } catch (error) {
                console.error("Response validation failed:", error);
                throw new Error("Invalid response data");
            }

            return data;
        }
    })
}
