import api from './axios';
import { ApiResponse, User } from '../types';

export const registerApi = async (data: any): Promise<User> => {
  const res = await api.post<ApiResponse<{ user: User }>>('/auth/register', data);
  return res.data.data!.user;
};

export const loginApi = async (data: any): Promise<User> => {
  const res = await api.post<ApiResponse<{ user: User }>>('/auth/login', data);
  return res.data.data!.user;
};

export const logoutApi = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const getMeApi = async (): Promise<User> => {
  const res = await api.get<ApiResponse<{ user: User }>>('/auth/me');
  return res.data.data!.user;
};
