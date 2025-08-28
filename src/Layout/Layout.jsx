import Header from "../components/Header";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import useAuth from "../tanstack-query-hooks/useAuthPile";
import useClickedModal from "../zustard/useClickedModal";
import ChangeCategoryContainer from "../components/ChangeCategoryContainer";
import OnBoarding from "../pages/OnBoarding";

const Layout = () => {
  const { data: user, isLoading, isError } = useAuth();
  console.log(isError);
  const { clicked } = useClickedModal();
  const location = useLocation();

  // Show loading while checking authentication
  if (isLoading) {
    return null;
  }

  // Show OnBoarding for unauthenticated users on root path
  if (!user && !isLoading && location.pathname === "/") {
    return (
      <div className="overflow-x-hidden">
        <Header />
        <OnBoarding />
      </div>
    );
  }

  // Redirect to root if not authenticated and not already on auth pages
  if (!user && !isLoading && !["/login"].includes(location.pathname)) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="overflow-x-hidden">
      <Header />
      {clicked.isOpen && <ChangeCategoryContainer />}
      <Outlet />
    </div>
  );
};

export default Layout;
