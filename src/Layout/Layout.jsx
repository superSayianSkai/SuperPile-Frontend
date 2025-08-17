import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import useAuth from "../tanstack-query-hooks/useAuthPile";
import useClickedModal from "../zustard/useClickedModal";
import ChangeCategoryContainer from "../components/ChangeCategoryContainer";

const Layout = () => {
  const { isLoading } = useAuth();
  const {clicked} = useClickedModal();
  if (isLoading) return null;

  return (
    <div className="overflow-x-hidden">
      <Header />
      {clicked.isOpen && <ChangeCategoryContainer />}
      <Outlet />
    </div>
  );
};

export default Layout;
