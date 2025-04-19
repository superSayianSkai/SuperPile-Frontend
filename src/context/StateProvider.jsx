import State from "./State";
import { StateContext } from "./SupaPileContext";
const StateProvider = ({ children }) => {
  const {
    LinkBoardPanel,
    setLinkBoardPanelToggle,
    pile,
    addPile,
    removePile,
    hostName,
    hostNameSentence,
    modifyTheHostName,
    metaLink,
    setTheMetaLink,
    setTheCategoryState,
    categoryState,
    categoryRef,
    tick,
    setTheTick
  } = State();
  return (
    <StateContext.Provider
      value={{
        LinkBoardPanel,
        setLinkBoardPanelToggle,
        pile,
        addPile,
        removePile,
        hostName,
        hostNameSentence,
        modifyTheHostName,
        metaLink,
        setTheMetaLink,
        setTheCategoryState,
        categoryState,
        categoryRef,
        tick,
        setTheTick
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export default StateProvider;
