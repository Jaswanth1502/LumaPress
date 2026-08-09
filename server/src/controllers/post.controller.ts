import { Response } from 'express';
import { Post } from '../models/Post.js';
import { Comment } from '../models/Comment.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { AppError } from '../utils/appError.js';
import { sanitizeString, slugify } from '../utils/helpers.js';
import { AuthenticatedRequest } from '../types/index.js';

// Generate a unique slug given a base title
const generateUniqueSlug = async (title: string, currentPostId?: string): Promise<string> => {
  let baseSlug = slugify(title);
  if (!baseSlug) baseSlug = 'untitled-post';

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await Post.findOne({ slug });
    if (!existing || (currentPostId && existing._id.toString() === currentPostId)) {
      return slug;
    }
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};

export const getPosts = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.max(1, Math.min(50, parseInt(req.query.limit as string) || 9));
  const skip = (page - 1) * limit;

  const { q, tag, sort } = req.query;

  const filter: any = { status: 'published' };

  if (tag) {
    filter.tags = tag as string;
  }

  if (q) {
    const searchRegex = new RegExp(q as string, 'i');
    filter.$or = [
      { title: searchRegex },
      { excerpt: searchRegex },
      { content: searchRegex },
      { tags: searchRegex },
    ];
  }

  const sortOrder = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

  const [posts, totalPosts] = await Promise.all([
    Post.find(filter)
      .populate('author', 'name email avatarUrl bio')
      .sort(sortOrder as any)
      .skip(skip)
      .limit(limit)
      .lean(),
    Post.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalPosts / limit) || 1;

  res.status(200).json({
    success: true,
    message: 'Posts fetched successfully',
    data: {
      posts,
      pagination: {
        totalPosts,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    },
  });
});

export const getPostBySlug = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { slug } = req.params;

  const post = await Post.findOne({ slug }).populate('author', 'name email avatarUrl bio').lean();

  if (!post) {
    throw new AppError('Blog post not found', 404);
  }

  // If post is a draft, only the author is allowed to view it
  if (post.status === 'draft') {
    if (!req.user || req.user.id !== post.author._id.toString()) {
      throw new AppError('You do not have permission to view this draft post', 403);
    }
  }

  res.status(200).json({
    success: true,
    message: 'Post retrieved successfully',
    data: { post },
  });
});

export const createPost = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const { title, excerpt, content, coverImage, tags, status } = req.body;

  const sanitizedContent = sanitizeString(content);
  const sanitizedExcerpt = sanitizeString(excerpt);
  const slug = await generateUniqueSlug(title);

  const post = await Post.create({
    title: title.trim(),
    slug,
    excerpt: sanitizedExcerpt.trim(),
    content: sanitizedContent,
    coverImage: coverImage || '',
    tags: Array.isArray(tags) ? tags.map((t: string) => t.trim()).filter(Boolean) : [],
    status: status || 'draft',
    author: req.user.id,
  });

  const populatedPost = await post.populate('author', 'name email avatarUrl bio');

  res.status(201).json({
    success: true,
    message: `Post ${post.status === 'published' ? 'published' : 'saved as draft'} successfully`,
    data: { post: populatedPost },
  });
});

export const updatePost = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const { id } = req.params;
  const post = await Post.findById(id);

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  // Check ownership
  if (post.author.toString() !== req.user.id) {
    throw new AppError('Unauthorized. You can only edit your own posts.', 403);
  }

  const { title, excerpt, content, coverImage, tags, status } = req.body;

  if (title && title.trim() !== post.title) {
    post.title = title.trim();
    post.slug = await generateUniqueSlug(title.trim(), post._id.toString());
  }

  if (excerpt !== undefined) {
    post.excerpt = sanitizeString(excerpt).trim();
  }

  if (content !== undefined) {
    post.content = sanitizeString(content);
  }

  if (coverImage !== undefined) {
    post.coverImage = coverImage;
  }

  if (tags !== undefined && Array.isArray(tags)) {
    post.tags = tags.map((t: string) => t.trim()).filter(Boolean);
  }

  if (status !== undefined) {
    post.status = status;
  }

  await post.save();
  const updatedPost = await post.populate('author', 'name email avatarUrl bio');

  res.status(200).json({
    success: true,
    message: 'Post updated successfully',
    data: { post: updatedPost },
  });
});

export const updatePostStatus = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const { id } = req.params;
  const { status } = req.body;

  const post = await Post.findById(id);
  if (!post) {
    throw new AppError('Post not found', 404);
  }

  if (post.author.toString() !== req.user.id) {
    throw new AppError('Unauthorized. You can only change the status of your own posts.', 403);
  }

  post.status = status;
  await post.save();
  const updatedPost = await post.populate('author', 'name email avatarUrl bio');

  res.status(200).json({
    success: true,
    message: `Post status updated to ${status}`,
    data: { post: updatedPost },
  });
});

export const deletePost = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const { id } = req.params;
  const post = await Post.findById(id);

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  // Check ownership
  if (post.author.toString() !== req.user.id) {
    throw new AppError('Unauthorized. You can only delete your own posts.', 403);
  }

  // Delete post and cascade delete associated comments
  await Promise.all([
    Post.findByIdAndDelete(id),
    Comment.deleteMany({ post: id }),
  ]);

  res.status(200).json({
    success: true,
    message: 'Post and associated comments deleted successfully',
  });
});

export const getMyPosts = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.max(1, Math.min(50, parseInt(req.query.limit as string) || 10));
  const skip = (page - 1) * limit;

  const { q, status } = req.query;

  const filter: any = { author: req.user.id };

  if (status && (status === 'published' || status === 'draft')) {
    filter.status = status;
  }

  if (q) {
    const searchRegex = new RegExp(q as string, 'i');
    filter.$or = [
      { title: searchRegex },
      { excerpt: searchRegex },
      { content: searchRegex },
    ];
  }

  const [posts, totalPosts, publishedCount, draftCount] = await Promise.all([
    Post.find(filter)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Post.countDocuments(filter),
    Post.countDocuments({ author: req.user.id, status: 'published' }),
    Post.countDocuments({ author: req.user.id, status: 'draft' }),
  ]);

  // Get total comments received across all author's posts
  const authorPostIds = await Post.find({ author: req.user.id }).distinct('_id');
  const totalCommentsReceived = await Comment.countDocuments({ post: { $in: authorPostIds } });

  const totalPages = Math.ceil(totalPosts / limit) || 1;

  res.status(200).json({
    success: true,
    message: 'User posts fetched successfully',
    data: {
      posts,
      stats: {
        totalPosts: publishedCount + draftCount,
        publishedPosts: publishedCount,
        draftPosts: draftCount,
        commentsReceived: totalCommentsReceived,
      },
      pagination: {
        totalPosts,
        totalPages,
        currentPage: page,
        limit,
      },
    },
  });
});
