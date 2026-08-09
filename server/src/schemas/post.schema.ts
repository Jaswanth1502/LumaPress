import { z } from 'zod';

export const createPostSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }).trim().min(1, 'Title cannot be empty or whitespace only'),
    excerpt: z.string({ required_error: 'Excerpt is required' }).trim().min(1, 'Excerpt cannot be empty or whitespace only'),
    content: z.string({ required_error: 'Content is required' }).trim().min(1, 'Content cannot be empty or whitespace only'),
    coverImage: z.string().optional().default(''),
    tags: z.array(z.string().trim()).optional().default([]),
    status: z.enum(['draft', 'published']).optional().default('draft'),
  }),
});

export const updatePostSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1, 'Title cannot be empty').optional(),
    excerpt: z.string().trim().min(1, 'Excerpt cannot be empty').optional(),
    content: z.string().trim().min(1, 'Content cannot be empty').optional(),
    coverImage: z.string().optional(),
    tags: z.array(z.string().trim()).optional(),
    status: z.enum(['draft', 'published']).optional(),
  }),
});

export const updatePostStatusSchema = z.object({
  body: z.object({
    status: z.enum(['draft', 'published'], { required_error: 'Status must be draft or published' }),
  }),
});
