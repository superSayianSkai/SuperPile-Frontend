import { Link } from "react-router";
import { menuIcons } from "../data/menuIcons";
import { useAuthStore } from "../zustard/useAuthStore";
import { useQueryClient } from "@tanstack/react-query";

const Profile = () => {
  const { setUser, setError } = useAuthStore();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      // Clear user state
      setUser(null);
      setError(false, null);
      
      // Clear all React Query cache
      queryClient.clear();
      
      // Clear service worker caches
      if ('serviceWorker' in navigator && 'caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }
      
      // Send message to service worker to force refresh
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'FORCE_REFRESH'
        });
      }
      
      // Redirect to backend logout endpoint to clear server-side session
      const baseURL = import.meta.env.VITE_BASE_URL;
      console.log(baseURL)  
      window.location.href = `${baseURL}/auth/v1/logout`;
      
    } catch (error) {
      console.error('Logout error:', error);
      // Force reload as fallback
      window.location.reload();
    }
  };

  const handleMenuClick = (icon) => {
    if (icon.action === 'logout') {
      handleLogout();
    }
  };

  return (
    <div className="bg-white dark:text-black shadow-xl absolute right-5 w-[200px] top-[5%] rounded-xl border-2 ">
      {menuIcons.map((icon, index) => {
        if (icon.action === 'logout') {
          return (
            <div
              key={index}
              onClick={() => handleMenuClick(icon)}
              className="flex group transition-all items-center gap-5 hover:bg-gray-200 px-6 py-4 text-[.8rem] cursor-pointer"
            >
              <style>{`
                .group:hover button {
                  background: linear-gradient(to right, #ff66b2, #ff8c00) !important;
                }
              `}</style>
              <i className={`${icon.iconClass}`}></i>
              <span>{icon.label}</span>
            </div>
          );
        }
        
        return (
          <Link
            to={icon.link}
            key={index}
            className="flex group transition-all items-center gap-5 hover:bg-gray-200 px-6 py-4 text-[.8rem] cursor-pointer"
          >
            <style>{`
              .group:hover button {
                background: linear-gradient(to right, #ff66b2, #ff8c00) !important;
              }
            `}</style>
            <i className={`${icon.iconClass}`}></i>
            <span>{icon.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default Profile;
