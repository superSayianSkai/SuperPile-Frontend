import { SuperPileContext } from "./SuperPileContext";
import { useState, useEffect } from "react";
import { v4 as uuidV4 } from "uuid";

const SuperPileProvider = ({ children }) => {
  // Toggle state
  const [LinkBoardPanel, setLinkBoardPanel] = useState(false);
  const setLinkBoardPanelToggle = () => {
    setLinkBoardPanel((prev) => !prev);
  };

  //getting the data in the local storage
  const getStoredPile = () => {
    const storedData = localStorage.getItem("pile");
    if (storedData) {
      try {
        return JSON.parse(storedData); // Return the parsed data if valid
      } catch (error) {
        console.error("Failed to parse stored data:", error);
        return []; // Return an empty array if parsing fails
      }
    }
    return []; // Return an empty array if no data exists in localStorage
  };

  const [pile, setPileLink] = useState(getStoredPile());

  // Add to pile
  const addPile = (newLink) => {
    const updatedPile = [
      ...pile,
      {
        id: uuidV4(),
        image: newLink.image,
        title: newLink.title,
        description: newLink.description,
        link: newLink.link,
      },
    ];
    setPileLink(updatedPile);
  };

  // Remove from pile
  const removePile = (newLink) => {
    const updatedPile = pile.filter((item) => item.id !== newLink.id);
    setPileLink(updatedPile);
  };

  useEffect(() => {
    localStorage.setItem("pile", JSON.stringify(pile));
  }, [pile]);

  return (
    <SuperPileContext.Provider
      value={{
        LinkBoardPanel,
        setLinkBoardPanelToggle,
        pile,
        addPile,
        removePile,
      }}
    >
      {children}
    </SuperPileContext.Provider>
  );
};

export default SuperPileProvider;
