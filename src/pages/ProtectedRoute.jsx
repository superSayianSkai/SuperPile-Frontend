import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../zustard/useAuthStore';

const ProtectedRoute = ({ children }) => {
  const { user, isLoading, getUser } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    // Check authentication status on mount
    if (!user && !isLoading) {
      getUser();
    }
  }, [user, isLoading, getUser]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/onBoarding" state={{ from: location }} replace />;
  }

  // Render protected content if authenticated
  return children;
};

export default ProtectedRoute;