import { Request, Response } from 'express';
import dns from 'dns/promises';
import { User } from '../models/User.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { AppError } from '../utils/appError.js';
import { clearAuthCookie, setAuthCookie, signToken } from '../utils/jwt.js';
import { AuthenticatedRequest } from '../types/index.js';
import { env } from '../config/env.js';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const normalizedEmail = email.toLowerCase().trim();

  // 1. Check duplicate email address
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new AppError('An account with this email address already exists.', 409, {
      email: 'Email address is already registered',
    });
  }

  // 2. Verify email domain existence via DNS MX Lookup (e.g. gmail.com, yahoo.com, etc.)
  const domain = normalizedEmail.split('@')[1];
  if (env.NODE_ENV !== 'test' && !['example.com', 'test.com', 'localhost'].includes(domain)) {
    try {
      const mxRecords = await dns.resolveMx(domain);
      if (!mxRecords || mxRecords.length === 0) {
        throw new Error('No MX records');
      }
    } catch {
      throw new AppError(
        `The email domain "${domain}" does not exist or has no active mail server. Please use a real email address (e.g. gmail.com, yahoo.com).`,
        400,
        { email: 'Invalid or non-existent email domain' }
      );
    }
  }

  // 3. Enforce Unique Password across all accounts (No password repetition allowed)
  const allUsersWithPasswords = await User.find().select('+password');
  for (const account of allUsersWithPasswords) {
    const isMatched = await account.comparePassword(password);
    if (isMatched) {
      throw new AppError(
        'This password is already in use by another registered user.',
        400,
        { password: 'Password is already in use' }
      );
    }
  }

  // 4. Create user account
  const user = await User.create({
    name,
    email: normalizedEmail,
    password,
  });

  const token = signToken({ id: user._id.toString(), email: user.email, role: user.role });
  setAuthCookie(res, token);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        role: user.role,
        createdAt: user.createdAt,
      },
    },
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password.', 401);
  }

  const token = signToken({ id: user._id.toString(), email: user.email, role: user.role });
  setAuthCookie(res, token);

  res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        role: user.role,
        createdAt: user.createdAt,
      },
    },
  });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  clearAuthCookie(res);
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

export const getMe = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Not authenticated', 401);
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Current user retrieved successfully',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    },
  });
});
