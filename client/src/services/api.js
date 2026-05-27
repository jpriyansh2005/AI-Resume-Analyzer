import axios from 'axios';
import { toast } from 'react-hot-toast';

let baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
if (baseUrl && !baseUrl.endsWith('/api') && !baseUrl.endsWith('/api/')) {
  baseUrl = baseUrl.endsWith('/') ? `${baseUrl}api` : `${baseUrl}/api`;
}

const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

// Request Interceptor: Attach authorization JWT token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Render cold start retries automatically
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if it's a network error (Render container is asleep) or gateway/timeout errors (502, 503, 504)
    const isColdStart = !error.response || [502, 503, 504].includes(error.response?.status);

    if (isColdStart && !originalRequest._retry) {
      originalRequest._retry = true;

      // Show toast loading alert
      const toastId = toast.loading('Waking up server... this may take 20–30 seconds', {
        style: {
          background: '#0f172a',
          color: '#fff',
          border: '1px solid rgba(139, 92, 246, 0.2)',
        }
      });

      // Wait 8 seconds before retrying to allow Render container startup
      await new Promise((resolve) => setTimeout(resolve, 8000));

      toast.dismiss(toastId);

      // Retry the original request
      return api(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default api;
