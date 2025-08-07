import Hero from "../components/Hero";
import PileBoard from "../components/PileBoard";
import { useContext,} from "react";
import { StateContext } from "../context/SupaPileContext";
import PilePanel from "../components/PilePanel";
import OnBoarding from "./OnBoarding";
import { useAuthStore } from "../zustard/useAuthStore";
const HomePage = () => {
  const { user: userData, isLoading, isError} = useAuthStore();
  const { LinkBoardPanel } = useContext(StateContext);
  return (
    <div className="bg-white dark:bg-black dark:text-white ">
      {isLoading ? (
        null
      ) : isError && !userData ? (
        
          <OnBoarding />
      
      ) : (
        <div
          className={`flex flex-col dark:bg-black relative ${
            LinkBoardPanel && userData ? "overflow-hidden" : ""
          } `}
        >
          <>
            <Hero />
            <PileBoard />
            {LinkBoardPanel && <PilePanel />}
          </>
        </div>
      )}
    </div>
  );
};

export default HomePage;
