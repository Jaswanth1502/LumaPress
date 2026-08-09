import { Response } from 'express';
import { Comment } from '../models/Comment.js';
import { Post } from '../models/Post.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { AppError } from '../utils/appError.js';
import { sanitizeString } from '../utils/helpers.js';
import { AuthenticatedRequest } from '../types/index.js';

export const getPostComments = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { postId } = req.params;

  const postExists = await Post.findById(postId);
  if (!postExists) {
    throw new AppError('Post not found', 404);
  }

  const comments = await Comment.find({ post: postId })
    .populate('author', 'name email avatarUrl')
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    message: 'Comments fetched successfully',
    data: { comments },
  });
});

export const createComment = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required to comment', 401);
  }

  const { postId } = req.params;
  const { content } = req.body;

  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError('Post not found', 404);
  }

  // If post is draft, non-authors cannot view or comment
  if (post.status === 'draft' && post.author.toString() !== req.user.id) {
    throw new AppError('Cannot comment on draft posts', 403);
  }

  const sanitizedContent = sanitizeString(content).trim();
  if (!sanitizedContent) {
    throw new AppError('Comment content cannot be empty or whitespace only', 400);
  }

  const comment = await Comment.create({
    content: sanitizedContent,
    post: postId,
    author: req.user.id,
  });

  const populatedComment = await comment.populate('author', 'name email avatarUrl');

  res.status(201).json({
    success: true,
    message: 'Comment added successfully',
    data: { comment: populatedComment },
  });
});

export const deleteComment = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const { id } = req.params;
  const comment = await Comment.findById(id);

  if (!comment) {
    throw new AppError('Comment not found', 404);
  }

  // User may delete ONLY their own comment
  if (comment.author.toString() !== req.user.id) {
    throw new AppError('Unauthorized. You can only delete your own comments.', 403);
  }

  await Comment.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'Comment deleted successfully',
  });
});
