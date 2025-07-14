import { Blog } from "@/models/blogModel.ts";
import { Comment } from "@/models/commentModel.ts";
import { type CreateCommentInput } from "@/validations/commentSchema.ts";
import type { Request, Response } from "express-serve-static-core";
import { Types } from "mongoose";

export const getAllComments = async (
    req: Request<{}, {}, {}, { isApproved?: string; page?: number; limit?: number }>,
    res: Response
) => {
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const userId = (req.user as { _id: string })._id.toString();

    const isApproved = req.query.isApproved === "true";

    try {

        const matchStage: any = {
            ...(typeof req.query.isApproved === "string" ? { isApproved } : { isApproved: true }),
        };

        const comments = await Comment.aggregate([
            { $match: matchStage },
            {
                $lookup: {
                    from: "blogs",
                    localField: "blog",
                    foreignField: "_id",
                    as: "blog",
                },
            },
            { $unwind: "$blog" },
            { $match: { "blog.author": new Types.ObjectId(userId) } },
            {
                $project: {
                    content: 1,
                    name: 1,
                    isApproved: 1,
                    createdAt: 1,
                    blog: { _id: 1, title: 1 },
                },
            },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
        ]);

        const total = await Comment.aggregate([
            { $match: matchStage },
            {
                $lookup: {
                    from: "blogs",
                    localField: "blog",
                    foreignField: "_id",
                    as: "blog",
                },
            },
            { $unwind: "$blog" },
            { $match: { "blog.author": new Types.ObjectId(userId) } },
            { $count: "total" },
        ]);

        const totalCount = total[0]?.total || 0;
        const totalPages = Math.ceil(totalCount / limit);

        res.status(200).json({
            success: true,
            message: "Comments fetched successfully",
            data: comments,
            pagination: {
                currentPage: page,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err instanceof Error ? err.message : "Something went wrong",
        });
    }
};


export const getApprovedCommentsForBlog = async (req: Request<{ blogId: string }>, res: Response) => {
    const { blogId } = req.params;

    try {

        const blogExists = await Blog.exists({ _id: blogId });
        if (!blogExists) {
            res.status(404).json({
                success: false,
                message: "Blog not found"
            })
            return;
        }

        const comments = await Comment.find({
            blog: blogId,
            isApproved: true
        }).select("-__v -blog -isApproved")
            .sort({ createdAt: -1 })
            .lean()

        res.status(200).json({
            success: true,
            message: `${comments.length} approved comment(s) found`,
            data: comments
        })

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err instanceof Error ? err.message : "Something went wrong"
        })
    }
}


export const createComment = async (req: Request<{ blogId: string }, {}, CreateCommentInput>, res: Response) => {

    const { blogId } = req.params;
    const { name, content } = req.body;

    try {
        const blogExists = await Blog.exists({ _id: blogId });
        if (!blogExists) {
            res.status(404).json({
                success: false,
                message: "Blog not found"
            })
            return;
        }

        const comment = await Comment.create({
            blog: blogId,
            name,
            content
        })

        res.status(201).json({
            success: true,
            message: "Comment created successfully and pending approval"
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err instanceof Error ? err.message : "Something went wrong"
        })
    }
}


export const approveComment = async (req: Request<{ id: string }>, res: Response) => {
    const commentId = req.params.id;
    const userId = (req.user as { _id: string })._id.toString();

    try {

        // Find the comment
        const comment = await Comment.findById(commentId);
        if (!comment) {
            res.status(404).json({
                success: false,
                message: "Comment not found"
            })
            return;
        }

        // Find the blog associated with the comment
        const blog = await Blog.findById(comment.blog);
        if (!blog) {
            res.status(404).json({
                success: false,
                message: "Blog associated with this comment not found"
            })
            return;
        }

        // Check if the authenticated user is the blog's author
        if (blog.author.toString() !== userId) {
            res.status(403).json({
                success: false,
                message: "You are not authorized to approve comments on this blog"
            })
            return;
        }

        comment.isApproved = true;
        await comment.save();

        res.status(200).json({
            success: true,
            message: "Comment approved successfully",
            data: {
                commentId: comment._id,
                blogId: blog._id
            }
        })

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err instanceof Error ? err.message : "Something went wrong"
        })
    }
}


export const deleteComment = async (req: Request<{ id: string }>, res: Response) => {

    const commentId = req.params.id;
    const userId = (req.user as { _id: string })._id.toString();

    try {

        // find comment and populate blog's author
        const comment = await Comment.findById(commentId)
            .populate<{ blog: { author: string; _id: string } }>('blog', 'author');

        if (!comment) {
            res.status(404).json({
                success: false,
                message: "Comment not found"
            })
            return;
        }

        // Check if the authenticated user is the blog's author
        if (comment.blog.author.toString() !== userId) {
            res.status(403).json({
                success: false,
                message: "You are not authorized to delete this comment"
            })
            return;
        }

        await Comment.deleteOne({ _id: commentId });

        res.status(200).json({
            success: true,
            message: "Comment deleted successfully",
            data: {
                _id: comment._id,
                blogId: comment.blog._id,
                isApproved: comment.isApproved
            }
        })

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err instanceof Error ? err.message : "Something went wrong"
        })
    }
}