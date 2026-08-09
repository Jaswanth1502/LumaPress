import { z } from 'zod';

export const strictEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const registerSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }).trim().min(1, 'Name cannot be empty'),
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .email('Invalid email address')
      .regex(strictEmailRegex, 'Please enter a valid email address with a domain (e.g. user@domain.com)'),
    password: z.string({ required_error: 'Password is required' }).min(1, 'Password is required'),
    confirmPassword: z.string({ required_error: 'Password confirmation is required' }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .email('Invalid email address')
      .regex(strictEmailRegex, 'Please enter a valid email address with a domain (e.g. user@domain.com)'),
    password: z.string({ required_error: 'Password is required' }).min(1, 'Password is required'),
  }),
});
