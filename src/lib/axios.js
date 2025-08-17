import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

// Response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired - clear user state and force re-render
      console.log('Token expired, clearing user state');
      
      // Import the auth store to clear user data
      import('../zustard/useAuthStore.js').then(({ useAuthStore }) => {
        const { setUser, setError } = useAuthStore.getState();
        setUser(null);
        setError(true, error);
      });
      
      // Clear any cached data in localStorage if you have any
      // localStorage.clear(); // Only if you store auth data in localStorage
    }
    return Promise.reject(error);
  }
);

export default apiClient;
