import Header from "../components/Header";
import { Outlet, Navigate} from "react-router-dom";
import useAuth from "../tanstack-query-hooks/useAuthPile";
import useClickedModal from "../zustard/useClickedModal";
import ChangeCategoryContainer from "../components/ChangeCategoryContainer";

const Layout = () => {
  const { data: user, isLoading,isError} = useAuth();
  console.log(isError)
  const { clicked } = useClickedModal();

  // Show loading while checking authentication
  if (isLoading) {
    return null
  }

  // Redirect to onboarding if not authenticated and not already on auth pages
  if (!user && !isLoading && !['/login', '/onBoarding'].includes(location.pathname)) {
    return <Navigate to="/onBoarding" replace />;
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
