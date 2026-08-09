import api from './axios';
import { ApiResponse, Post, User } from '../types';

export interface UserProfileResponse {
  user: {
    id: string;
    name: string;
    avatarUrl?: string;
    bio?: string;
    createdAt: string;
  };
  posts: Post[];
}

export const getUserProfileApi = async (userId: string): Promise<UserProfileResponse> => {
  const res = await api.get<ApiResponse<UserProfileResponse>>(`/users/${userId}`);
  return res.data.data!;
};

export const updateMyProfileApi = async (data: { name?: string; bio?: string; avatarUrl?: string }): Promise<User> => {
  const res = await api.patch<ApiResponse<{ user: User }>>('/users/me', data);
  return res.data.data!.user;
};
