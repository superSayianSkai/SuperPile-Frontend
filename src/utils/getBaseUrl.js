// Utility function to get the appropriate base URL
export const getBaseUrl = () => {
  // Check if we're in development mode
  if (import.meta.env.DEV) {
    // Check if accessing from mobile device or different network
    const isMobileNetwork = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    
    if (isMobileNetwork) {
      return import.meta.env.VITE_BASE_URL_MOBILE;
    }
    return import.meta.env.VITE_BASE_URL;
  }
  
  // Production URL (you can add VITE_BASE_URL_PROD later)
  return import.meta.env.VITE_BASE_URL;
};