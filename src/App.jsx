import Header from "./components/Header";
import Hero from "./components/Hero";
import PileBoard from "./components/PileBoard";
import { useContext, useEffect } from "react";
import { StateContext } from "./context/SupaPileContext";
import useAuth from "./hooks/useAuthPile";
import PilePanel from "../src/components/PilePanel";
import Login from "./components/Login";

const App = () => {
  const userData = useAuth()?.data;
  const { LinkBoardPanel,categoryState } = useContext(StateContext);
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

export default App;
