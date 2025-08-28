
import { useAuthStore } from '../zustard/useAuthStore';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuthStore();
  
  return user ? children : null;
};

export default ProtectedRoute;