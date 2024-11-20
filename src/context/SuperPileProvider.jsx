import { SuperPileContext } from "./SuperPileContext";
import { useState } from "react";

const SuperPileProvider = ({ children }) => {
  const [LinkBoardPanel, setLinkBoardPanel] = useState(false);
  const setLinkBoardPanelToggle = () => {
    setLinkBoardPanel((prev) => !prev);
  };
  return (
    <SuperPileContext.Provider
      value={{ LinkBoardPanel, setLinkBoardPanelToggle }}
    >
      {children}
    </SuperPileContext.Provider>
  );
};

export default SuperPileProvider;
