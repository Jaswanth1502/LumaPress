import { z } from 'zod';

export const updateUserProfileSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, 'Name cannot be empty').optional(),
    bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
    avatarUrl: z.string().optional(),
  }),
});
