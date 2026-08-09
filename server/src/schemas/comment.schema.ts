import { z } from 'zod';

export const createCommentSchema = z.object({
  body: z.object({
    content: z.string({ required_error: 'Comment content is required' }).trim().min(1, 'Comment cannot be empty or whitespace only'),
  }),
});
