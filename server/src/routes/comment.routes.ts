import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { createComment, deleteComment, getPostComments } from '../controllers/comment.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.js';
import { createCommentSchema } from '../schemas/comment.schema.js';
import { env } from '../config/env.js';

const router = Router({ mergeParams: true });

const commentRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 30,
  skip: () => env.NODE_ENV === 'test',
  message: {
    success: false,
    message: 'Too many comments posted from this IP, please try again shortly.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.get('/', getPostComments);
router.post('/', requireAuth, commentRateLimiter, validate(createCommentSchema), createComment);

export default router;
