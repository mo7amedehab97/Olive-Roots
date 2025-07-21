import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAxios from './useAxios';


export default function useDeleteBlog() {
    const queryClient = useQueryClient();
    const axios = useAxios();

    return useMutation({
        mutationKey: ["deleteBlog"],
        mutationFn: async (blogId: string) => {
            const { data } = await axios.delete(`/v1/blogs/${blogId}`);

            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["authorBlogs"], exact: false });
            queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
            queryClient.invalidateQueries({ queryKey: ["blogs", "all"], exact: false });
            queryClient.invalidateQueries({ queryKey: ["blogs", data.data.category], exact: false });
            queryClient.removeQueries({ queryKey: ["blog", data.data._id] });
        }
    })

}
