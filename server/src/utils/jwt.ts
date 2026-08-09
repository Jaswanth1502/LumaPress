import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { env } from '../config/env.js';
import { IUserPayload } from '../types/index.js';

export const COOKIE_NAME = 'lumapress_token';

export const signToken = (payload: IUserPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): IUserPayload => {
  return jwt.verify(token, env.JWT_SECRET) as IUserPayload;
};

export const setAuthCookie = (res: Response, token: string) => {
  const isProduction = env.NODE_ENV === 'production';
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
};

export const clearAuthCookie = (res: Response) => {
  const isProduction = env.NODE_ENV === 'production';
  res.cookie(COOKIE_NAME, '', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    expires: new Date(0),
    path: '/',
  });
};
