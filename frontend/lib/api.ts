import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// This is a request interceptor. It runs before any request is sent.
api.interceptors.request.use(
  (config) => {
    // We only run this on the client-side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token.trim()}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;