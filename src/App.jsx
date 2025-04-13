import Header from "./components/Header";
import Hero from "./components/Hero";
import LinkBoard from "./components/LinkBoard";
import { useContext } from "react";
import { SupaPileContext } from "./context/SupaPileContext";
import useAuth from "./hooks/useAuthPile";
import LinkPanel from "../src/components/LinkPanel";
import Login from "./components/Login";

const App = () => {
  const userData = useAuth()?.data;
  const { LinkBoardPanel } = useContext(SupaPileContext);

  return (
    <div
      className={`h-[100vh] flex flex-col ${
        LinkBoardPanel && userData ? "overflow-hidden" : ""
      } `}
    >
      <Header />
      <Hero />
      {/* want to fix the hero later*/}
      <LinkBoard />
      {LinkBoardPanel && !userData ? (
        <Login />
      ) : LinkBoardPanel && userData ? (
        <LinkPanel />
      ) : (
        ""
      )}
    </div>
  );
};

export default App;
