import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { getMe, login, logout, register } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.js';
import { loginSchema, registerSchema } from '../schemas/auth.schema.js';
import { env } from '../config/env.js';

const router = Router();

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  skip: () => env.NODE_ENV === 'test',
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP, please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', authRateLimiter, validate(registerSchema), register);
router.post('/login', authRateLimiter, validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', requireAuth, getMe);

export default router;
