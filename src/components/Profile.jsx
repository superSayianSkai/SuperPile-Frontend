import { Link } from "react-router";
import { menuIcons,} from "../data/menuIcons";
const Profile = () => {
  return (
    <div  className="bg-white shadow-xl absolute right-5 w-[200px] top-[8%] rounded-xl border-2 ">
      {menuIcons.map( (icon,index) => (
          <Link to="archived" key={index} className="flex items-center gap-5 hover:bg-gray-200 px-6 py-4 text-[.8rem] cursor-pointer">
            <i className={icon.iconClass}></i>
            <span>{icon.label}</span>
          </Link>
        )
      )}
    </div>
  );
};

export default Profile;
