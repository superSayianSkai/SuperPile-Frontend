import { SupaPileContext } from "./SupaPileContext";
import { ContextVariable } from "./ContextVariables";

const SupaPileProvider = ({ children }) => {
  const {
    LinkBoardPanel,
    setLinkBoardPanelToggle,
    pile,
    addPile,  
    removePile,
    handleSignIn,
  } = ContextVariable();
  return (
    <SupaPileContext.Provider
      value={{
        LinkBoardPanel,
        setLinkBoardPanelToggle,
        pile,
        addPile,
        removePile,
        handleSignIn,
      }}
    >
      {children}
    </SupaPileContext.Provider>
  );
};

export default SupaPileProvider;
