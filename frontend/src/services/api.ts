import axios from 'axios';
import type { ApiResponse } from '../types';

const client = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.response.use(
  (response) => {
    const payload = response.data as ApiResponse<unknown>;
    if (payload && typeof payload === 'object' && 'success' in payload) {
      return payload.data;
    }
    return response.data;
  },
  (error) => {
    // Extract error message from response
    const errorMessage =
      error?.response?.data?.error ||
      error?.message ||
      'Something went wrong. Please try again.';
    
    // Attach the error message to the error object for component access
    if (error?.response?.data) {
      error.response.data.message = errorMessage;
    }
    
    return Promise.reject(error);
  },
);

const API = {
  get: <T>(path: string) => client.get<T, T>(path),
  post: <T = unknown>(path: string, body?: unknown) => client.post<T, T>(path, body),
  put: <T = unknown>(path: string, body?: unknown) => client.put<T, T>(path, body),
  delete: <T = unknown>(path: string) => client.delete<T, T>(path),
};

export default API;
