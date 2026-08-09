import { Router } from 'express';
import { getUserProfile, updateMyProfile } from '../controllers/user.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.js';
import { updateUserProfileSchema } from '../schemas/user.schema.js';

const router = Router();

router.patch('/me', requireAuth, validate(updateUserProfileSchema), updateMyProfile);
router.get('/:id', getUserProfile);

export default router;
