import { useMutation } from '@tanstack/react-query';
import useAxios from './useAxios';
import * as yup from 'yup';

const generateDescriptionResponseSchema = yup.object({
    success: yup.boolean().required(),
    message: yup.string().required(),
    data: yup.object({
        description: yup.string().required()
    }).required()
});

export default function useGenerateDescription() {
    const axios = useAxios();

    return useMutation({
        mutationKey: ["generateDescription"],
        mutationFn: async (prompt: string) => {
            const { data } = await axios.post("/v1/blogs/generate-description", { prompt });

            try {
                await generateDescriptionResponseSchema.validate(data, { abortEarly: false });
                return JSON.parse(JSON.stringify(data.data));
            } catch (error) {
                console.error('Response validation failed:', error);
                throw new Error('Invalid response format');
            }
        }
    })
}
