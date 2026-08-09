import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError.js';
import { env } from '../config/env.js';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || undefined;

  // Handle Mongoose Duplicate Key Error (E11000)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `An account or record with this ${field} already exists`;
    errors = { [field]: `This ${field} is already in use` };
  }

  // Handle Mongoose CastError (Invalid ID format)
  if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Requested resource not found';
  }

  // Handle Mongoose ValidationError
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Failed';
    errors = Object.keys(err.errors).reduce((acc: Record<string, string>, key) => {
      acc[key] = err.errors[key].message;
      return acc;
    }, {});
  }

  if (env.NODE_ENV === 'development' && statusCode === 500) {
    console.error('[Unhandled Server Error]:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
    ...(env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
};
