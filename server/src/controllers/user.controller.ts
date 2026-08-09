import { Response } from 'express';
import { User } from '../models/User.js';
import { Post } from '../models/Post.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { AppError } from '../utils/appError.js';
import { AuthenticatedRequest } from '../types/index.js';

export const getUserProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const user = await User.findById(id).select('name email avatarUrl bio createdAt').lean();
  if (!user) {
    throw new AppError('User profile not found', 404);
  }

  const posts = await Post.find({ author: id, status: 'published' })
    .sort({ createdAt: -1 })
    .populate('author', 'name email avatarUrl')
    .lean();

  res.status(200).json({
    success: true,
    message: 'User profile retrieved successfully',
    data: {
      user: {
        id: user._id,
        name: user.name,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        createdAt: user.createdAt,
      },
      posts,
    },
  });
});

export const updateMyProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const { name, bio, avatarUrl } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) {
    throw new AppError('User profile not found', 404);
  }

  if (name !== undefined) user.name = name.trim();
  if (bio !== undefined) user.bio = bio.trim();
  if (avatarUrl !== undefined) user.avatarUrl = avatarUrl.trim();

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
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
