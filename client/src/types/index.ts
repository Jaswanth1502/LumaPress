export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt?: string;
}

export interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tags: string[];
  status: 'draft' | 'published';
  author: {
    _id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    bio?: string;
  };
  readingTime: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  content: string;
  post: string;
  author: {
    _id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  totalPosts: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

export interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  commentsReceived: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>;
}
