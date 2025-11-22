import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loop by not retrying auth endpoints
    const isAuthEndpoint = originalRequest.url?.includes('/auth/refresh-token') || 
                          originalRequest.url?.includes('/auth/logout') ||
                          originalRequest.url?.includes('/auth/me');

    // If error is 401 and we haven't tried to refresh yet and it's not an auth endpoint
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        await api.post('/auth/refresh-token');
        
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, don't retry again
        return Promise.reject(refreshError);
      }
    }

    const message = error.response?.data?.message || 'Something went wrong';
    return Promise.reject({ ...error, message });
  }
);

export default api;
