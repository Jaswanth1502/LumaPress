import api from './axios';
import { ApiResponse, Comment } from '../types';

export const getPostCommentsApi = async (postId: string): Promise<Comment[]> => {
  const res = await api.get<ApiResponse<{ comments: Comment[] }>>(`/posts/${postId}/comments`);
  return res.data.data!.comments;
};

export const createCommentApi = async (postId: string, content: string): Promise<Comment> => {
  const res = await api.post<ApiResponse<{ comment: Comment }>>(`/posts/${postId}/comments`, { content });
  return res.data.data!.comment;
};

export const deleteCommentApi = async (commentId: string): Promise<void> => {
  await api.delete(`/comments/${commentId}`);
};
