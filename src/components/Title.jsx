import lain from "../assets/Images/lane wallpaper ✨.jpeg";
import skai from "../assets/Images/skai.jpeg";
import boy from "../assets/Images/fullstack.gif"
const Title = () => {
  return (
    <div className="flex flex-col items-center  text-black  relative">
      {/* <p className="font-bold md:text-[2rem] color">Skai, save URLs for Later.</p> */}
      <img
        style={{ }}
        src={boy}
        className="h-[180px] md:h-[220px] w-[100%] object-cover  "
      />
      <img
        src={skai}
        className="w-[100px] h-[100px] md:w-[120px] md:h-[120px] rounded-full border-[4px]  absolute bottom-[-50px] md:bottom-[-70px] left-[19px] md:left-[50px]"
      />
    </div>
  );
};

export default Title;
