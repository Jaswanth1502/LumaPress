import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { AppError } from '../utils/appError.js';

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.reduce((acc: Record<string, string>, curr) => {
          const field = curr.path.length > 1 ? curr.path[1] : curr.path[0] || 'general';
          acc[field] = curr.message;
          return acc;
        }, {});
        return next(new AppError('Validation failed', 400, formattedErrors));
      }
      next(error);
    }
  };
};
