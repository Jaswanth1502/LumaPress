import { Router } from 'express';
import {
  createPost,
  deletePost,
  getMyPosts,
  getPostBySlug,
  getPosts,
  updatePost,
  updatePostStatus,
} from '../controllers/post.controller.js';
import { optionalAuth, requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.js';
import { createPostSchema, updatePostSchema, updatePostStatusSchema } from '../schemas/post.schema.js';
import commentRoutes from './comment.routes.js';

const router = Router();

// Nested comment routes: /api/posts/:postId/comments
router.use('/:postId/comments', commentRoutes);

router.get('/', getPosts);
router.get('/me', requireAuth, getMyPosts);
router.get('/:slug', optionalAuth, getPostBySlug);

router.post('/', requireAuth, validate(createPostSchema), createPost);
router.patch('/:id', requireAuth, validate(updatePostSchema), updatePost);
router.patch('/:id/status', requireAuth, validate(updatePostStatusSchema), updatePostStatus);
router.delete('/:id', requireAuth, deletePost);

export default router;
