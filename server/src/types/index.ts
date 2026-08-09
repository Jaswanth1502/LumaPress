import { Request } from 'express';
import { Types } from 'mongoose';

export interface IUserPayload {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

export interface AuthenticatedRequest extends Request {
  user?: IUserPayload;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
}
