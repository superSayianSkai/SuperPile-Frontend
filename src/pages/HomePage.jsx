import Header from "../components/Header";
import Hero from "../components/Hero";
import PileBoard from "../components/PileBoard";
import { useContext} from "react";
import { StateContext } from "../context/SupaPileContext";
import useAuth from "../tanstack-query-hooks/useAuthPile";
import PilePanel from "../components/PilePanel";
import Login from "../components/Login";
const HomePage = () => {
  const userData = useAuth()?.data;
  const { LinkBoardPanel} = useContext(StateContext);
  return ( 
    <div
      className={`h-[100vh] flex flex-col relative ${
        LinkBoardPanel && userData ? "overflow-hidden" : ""
      } `}
    >
      <Header />
      <Hero />
      {/* want to fix the hero later*/}
      <PileBoard />
      {LinkBoardPanel && !userData ? (
        <Login />
      ) : LinkBoardPanel && userData ? (
        <PilePanel />
      ) : (
        ""
      )}
    </div>
  );
};

export default HomePage;
