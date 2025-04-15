import State from "./State";
import { StateContext } from "./SupaPileContext";
const StateProvider = ({ children }) => {
  const {
    LinkBoardPanel,
    setLinkBoardPanelToggle,
    pile,
    addPile,
    removePile,
    modifyTheHostName,
    metaLink,
    setTheMetaLink,
  } = State();
  return (
    <StateContext.Provider
      value={{
        LinkBoardPanel,
        setLinkBoardPanelToggle,
        pile,
        addPile,
        removePile,
        modifyTheHostName,
        metaLink,
        setTheMetaLink,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export default StateProvider;
