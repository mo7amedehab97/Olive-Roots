import { Router } from "express";
import * as BlogController from "@/controllers/blogController.ts";
import { authenticateJWT } from "@/middlewares/authenticateJWT.ts";
import { validate } from "@/middlewares/validate.ts";
import { createBlogSchema, generateDescriptionSchema, updateBlogSchema } from "@/validations/blogSchema.ts";
import { upload } from "@/middlewares/multer.ts";

const router = Router();


/**
 * @route GET /api/v1/blogs/author
 * @desc Get all blogs created by the logged-in author (paginated)
 * @access Private
 * @query { limit? number, page?: number }
 */
router.get(
    "/author",
    authenticateJWT,
    BlogController.getBlogsForAuthor
);


/**
 * @route GET /api/v1/blogs/dashboard
 * @desc Get dashboard statistics (total blogs, total comments, latest 6 blogs)
 * @access Private 
 */
router.get(
    "/dashboard",
    authenticateJWT,
    BlogController.getDashboardStats
)


/**
 * @route GET /api/v1/blogs/category/:category
 * @desc Get published blogs filtered by category (paginated)
 * @access Public
 * @params { category: BlogCategory }
 * @query { limit?:number, page?: number }
 */
router.get(
    "/category/:category",
    BlogController.getBlogsByCategory
);


/**
 * @route GET /api/v1/blogs/:id
 * @desc Get a single blog post by ID
 * @access Private
 * @params { id: string }
 */
router.get(
    "/:id",
    BlogController.getBlogById
);


/**
 * @route POST /api/v1/blogs
 * @desc Create a new blog post by an authenticated author
 * @access Private
 * @body { title, subTitle, description, category, image }
 */
router.post(
    "/",
    authenticateJWT,
    upload.single("image"),
    validate({ body: createBlogSchema }),
    BlogController.createBlog
);


/**
 * @route POST /api/v1/blogs/generate-description
 * @desc Generate a blog description using AI based on prompt
 * @access Private
 */
router.post(
    "/generate-description",
    authenticateJWT,
    validate({ body: generateDescriptionSchema }),
    BlogController.generateDescription
)

/**
 * @route PATCH /api/v1/blogs/:id/published
 * @desc Toggle the `isPublished` status of a blog post (publish/unpublish)
 * @access Private (only the author can toggle)
 * @params { id: string } - ID of the blog post to toggle
 */
router.patch(
    "/:id/publish",
    authenticateJWT,
    BlogController.togglePublish
);


/**
 * @route PUT /api/v1/blogs/:id
 * @desc Update a blog post by ID
 * @access Private (only the author can update)
 * @params { id: string }
 */
router.patch(
    "/:id",
    authenticateJWT,
    upload.single("image"),
    validate({ body: updateBlogSchema }),
    BlogController.updateBlog
);


/**
 * @route DELETE /api/v1/blogs/:id
 * @desc Delete a blog post by ID (only by its author)
 * @access Private
 * @params { id: string }
 */
router.delete(
    "/:id",
    authenticateJWT,
    BlogController.deleteBlog
)


export default router;