import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Response interceptor to handle token expiration and refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        // Attempt to refresh the token
        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        
        // If refresh successful, process queued requests
        processQueue(null, refreshResponse.data.token);
        isRefreshing = false;
        
        // Retry the original request
        return apiClient(originalRequest);
        
      } catch (refreshError) {
        // Refresh failed - clear user state and redirect to login
        processQueue(refreshError, null);
        isRefreshing = false;
        
        console.log('Token refresh failed, clearing user state');
        
        // Import the auth store to clear user data
        import('../zustard/useAuthStore.js').then(({ useAuthStore }) => {
          const { setUser, setError, logout } = useAuthStore.getState();
          logout(); // Use the logout method instead of manually setting state
          setError(true, refreshError);
        });
        
        // Clear any cached data in localStorage if you have any
        // localStorage.clear(); // Only if you store auth data in localStorage
        
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
