import { useState, useEffect } from "react";
import useFetchUserPublicPile from "../tanstack-query-hooks/useFetchPublicPile";
import { useParams } from "react-router";
import { useNavigate } from "react-router";

const Hero = () => {
  const navLink = useNavigate();
  const { publicLinkToken } = useParams();
  const { data, refetch, isError, error } = useFetchUserPublicPile(publicLinkToken);
  console.log(data)
  const name = data?.data?.[0]?.name;
  const newName = name?.split(" ")[0];
  const timer = data?.expiresAt ? new Date(data.expiresAt) : null;
  const [timeLeft, setTimeLeft] = useState("");

useEffect(() => {
  console.log(error)
  if (isError && error?.response?.status === 410) {
navLink("/")
  }
}, [isError, error, navLink]);

  useEffect(() => {
    if (!timer) return;

    const interval = setInterval(() => {
      const remaining = timer - Date.now();
      if (remaining <= 0) {
        setTimeLeft("Expired");
        clearInterval(interval);
        refetch();
        navLink("/");
      } else {
        const minutes = Math.floor(remaining / 1000 / 60);
        const seconds = Math.floor((remaining / 1000) % 60);
        setTimeLeft(`${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

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
      <div className="text-xs text-red-600 mt-1">
      </div>
        Expires in: {timeLeft}
    </div>
  );
};

export default Hero;
