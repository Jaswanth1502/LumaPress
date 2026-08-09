import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import { COOKIE_NAME, verifyToken } from '../utils/jwt.js';
import { AppError } from '../utils/appError.js';

export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let token = req.cookies?.[COOKIE_NAME];

  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Authentication required. Please log in.', 401));
  }

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    return next(new AppError('Invalid or expired authentication token. Please log in again.', 401));
  }
};

export const optionalAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let token = req.cookies?.[COOKIE_NAME];

  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const payload = verifyToken(token);
      req.user = payload;
    } catch {
      // Ignore token verification failure for public endpoints with optional user context
    }
  }

  next();
};
