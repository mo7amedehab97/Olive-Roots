import { formatDateReadable } from '@utils/formatDate';
import { CheckCircle, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import type { Comment } from '@hooks/useAdminComments';
import useApproveComment from '@hooks/useApproveComment';
import toast from 'react-hot-toast';
import useDeleteComment from '@hooks/useDeleteComment';


interface CommentRowProps {
    comment: Comment
}

const CommentRow: FC<CommentRowProps> = ({ comment }) => {

    const { mutate: approveComment, isPending: isApproveCommentPending } = useApproveComment();
    const { mutate: deleteComment, isPending: isDeleteCommentPending } = useDeleteComment();

    const handleCommentDelete = (id: string) => {
        const confirmDelete = confirm("Are you sure you want to delete this comment?");
        if (!confirmDelete) return;
        deleteComment(id, {
            onSuccess: () => {
                toast.success("Comment deleted successfully.");
            },
            onError: () => {
                toast.error("Failed to delete the comment. Please try again.");
            }
        });
    }

    const handleCommentApprove = (id: string) => {
        approveComment(id, {
            onSuccess: () => {
                toast.success("Comment approved successfully.");
            },
            onError: () => {
                toast.error("Failed to approve the comment. Please try again.");
            }
        })
    }


    return (
        <tr key={comment._id} className="font-light border-b border-gray-200 last:*:pb-12">
            <td className="p-4">
                <p className='mb-4 text-gray-700 line-clamp-2'>
                    <span className='font-medium'>Blog: </span>
                    {comment.blog.title}
                </p>
                <p className='text-gray-700'>
                    <span className='font-medium'>Name: </span>
                    {comment.name}
                </p>
                <p className='text-gray-700'>
                    <span className='font-medium'>Comment:</span> {comment.content}
                </p>
            </td>
            <td className='p-4 text-gray-700'>
                {formatDateReadable(comment.createdAt)}
            </td>
            <td className='p-4'>
                <div className='flex items-center justify-end gap-x-2'>
                    {
                        !comment.isApproved ? (
                            <motion.button
                                type="button"
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleCommentApprove(comment._id)}
                                className="p-1 rounded-full cursor-pointer"
                                disabled={isApproveCommentPending}
                            >
                                <motion.div
                                    initial={{ stroke: "#22c55e" }}
                                    whileTap={{ stroke: "#16a34a" }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    style={{ display: "inline-block" }}
                                >
                                    <CheckCircle size={24} className='text-green-600' />
                                </motion.div>
                            </motion.button>
                        ) : (
                            <p className='px-3 py-1 text-xs text-green-600 bg-green-100 border border-green-600 rounded-full'>
                                Approved
                            </p>
                        )
                    }
                    <motion.button
                        type="button"
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="p-1 rounded-full cursor-pointer"
                        disabled={isDeleteCommentPending}
                        onClick={() => handleCommentDelete(comment._id)}
                    >
                        <motion.div
                            initial={{ color: "#4B5563" }}
                            whileHover={{ color: "#EF4444" }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            style={{ display: "inline-block" }}
                        >
                            <Trash2 className="size-6" />
                        </motion.div>
                    </motion.button>
                </div>
            </td>
        </tr>
    );
}


export default CommentRow;