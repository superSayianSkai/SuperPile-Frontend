import { Link } from "react-router";
import { menuIcons } from "../data/menuIcons";
import useLogout from "../tanstack-query-hooks/useLogout";

const Profile = () => {
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleMenuClick = (icon) => {
    if (icon.action === 'logout') {
      handleLogout();
    }
  };

  return (
    <div className="bg-white dark:text-black shadow-xl absolute right-0 w-[200px] top-[5%] rounded-xl border-2 overflow-hidden">
      {menuIcons.map((icon, index) => {
        if (icon.action === 'logout') {
          return (
            <div
              key={index}
              onClick={() => handleMenuClick(icon)}
              className={`flex ${icon.label=="Log out" && "text-red-500"}  group transition-all items-center gap-5 hover:bg-gray-200 px-6 py-4 text-[.8rem] cursor-pointer`}
            >
              <style>{`
                .group:hover button {
                  background: linear-gradient(to right, #ff66b2, #ff8c00) !important;
                }
              `}</style>
              <i className={`${icon.iconClass}`}></i>
              <span>{logoutMutation.isPending ? 'Logging out...' : icon.label}</span>
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
