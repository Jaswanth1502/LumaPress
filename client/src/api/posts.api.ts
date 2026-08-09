import api from './axios';
import { ApiResponse, PaginationMeta, Post } from '../types';

export interface GetPostsParams {
  page?: number;
  limit?: number;
  q?: string;
  tag?: string;
  sort?: 'newest' | 'oldest';
}

export interface PostsResponse {
  posts: Post[];
  pagination: PaginationMeta;
}

export const getPostsApi = async (params: GetPostsParams): Promise<PostsResponse> => {
  const res = await api.get<ApiResponse<PostsResponse>>('/posts', { params });
  return res.data.data!;
};

export const getPostBySlugApi = async (slug: string): Promise<Post> => {
  const res = await api.get<ApiResponse<{ post: Post }>>(`/posts/${slug}`);
  return res.data.data!.post;
};

export const createPostApi = async (data: Partial<Post>): Promise<Post> => {
  const res = await api.post<ApiResponse<{ post: Post }>>('/posts', data);
  return res.data.data!.post;
};

export const updatePostApi = async (id: string, data: Partial<Post>): Promise<Post> => {
  const res = await api.patch<ApiResponse<{ post: Post }>>(`/posts/${id}`, data);
  return res.data.data!.post;
};

export const updatePostStatusApi = async (id: string, status: 'draft' | 'published'): Promise<Post> => {
  const res = await api.patch<ApiResponse<{ post: Post }>>(`/posts/${id}/status`, { status });
  return res.data.data!.post;
};

export const deletePostApi = async (id: string): Promise<void> => {
  await api.delete(`/posts/${id}`);
};

export interface MyPostsResponse {
  posts: Post[];
  stats: {
    totalPosts: number;
    publishedPosts: number;
    draftPosts: number;
    commentsReceived: number;
  };
  pagination: PaginationMeta;
}

export const getMyPostsApi = async (params: { page?: number; limit?: number; q?: string; status?: string }): Promise<MyPostsResponse> => {
  const res = await api.get<ApiResponse<MyPostsResponse>>('/posts/me', { params });
  return res.data.data!;
};
