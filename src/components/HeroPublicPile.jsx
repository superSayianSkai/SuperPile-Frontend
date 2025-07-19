import useFetchUserPublicPile from "../tanstack-query-hooks/useFetchPublicPile";
import { useParams } from "react-router";
const Hero = () => {
  const { uuID } = useParams();
  const { data } = useFetchUserPublicPile(uuID);
  const name = data?.data?.[0]?.name;
  console.log(name);
  const newName = name?.split(" ")[0];
  console.log(newName);

  return (
    <div className="flex flex-col items-center  text-black  relative my-[6rem] gap-[.8rem]">
      <h2 className="font-bold text-[1.8rem] md:text-[3rem] color">
        {newName}&apos;s PileBoard
      </h2>
      <div
        className={`rounded-2xl text-sm  px-4 py-1 flex items-center "border-[1px] border-[#ff8c00]"
        }`}
      >
        This is a list of pile, {newName} wants you to see.
      </div>
    </div>
  );
};

export default Hero;
