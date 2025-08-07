import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import useAuth from "../tanstack-query-hooks/useAuthPile";

const Layout = () => {
  const { isLoading} = useAuth();

  if (isLoading) return null;

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default Layout;