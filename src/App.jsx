import Header from "./components/Header";
import Title from "./components/Title";
import LinkBoard from "./components/LinkBoard";
import { useContext } from "react";
import { SuperPileContext } from "./context/SuperPileContext";
import Login from "./components/Login";
const App = () => {
  const { LinkBoardPanel } = useContext(SuperPileContext);

  return (
    <div
      className={`h-[100vh] flex flex-col ${
        LinkBoardPanel ? "overflow-hidden" : ""
      } `}
    >
      <Header />
      <Title />
      <LinkBoard />
      {LinkBoardPanel ? <Login /> : ""}
    </div>
  );
};

export default App;
