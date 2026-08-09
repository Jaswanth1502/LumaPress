import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
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
