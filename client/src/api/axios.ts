import axios from 'axios';

const getBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (import.meta.env.DEV) {
    return 'http://localhost:5050/api';
  }
  return '/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      message: error.response?.data?.message || 'An unexpected error occurred',
      errors: error.response?.data?.errors,
      status: error.response?.status || 500,
    };
    return Promise.reject(customError);
  }
);

export default api;
