import { useState, useEffect } from "react";
import { v4 as uuidV4 } from "uuid";

export const ContextVariable = () => {
  const [LinkBoardPanel, setLinkBoardPanel] = useState(false);
  const baseURL = import.meta.env.VITE_BASE_URL;
 
 console.log(baseURL)
  const setLinkBoardPanelToggle = () => {
    setLinkBoardPanel((prev) => !prev);
  };

  
  //sign in to google start
  const handleSignIn = (e) => {
    e.preventDefault();
    console.log("Redirecting to google sign in");
    window.location.href = `${baseURL}/auth/google`;
  };

  //sign in to google end

  //getting the data in the local storage start
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
  // ends

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

  useEffect(() => {
    localStorage.setItem("pile", JSON.stringify(pile));
  }, [pile]);

  // Remove from pile
  const removePile = (newLink) => {
    const updatedPile = pile.filter((item) => item.id !== newLink.id);
    setPileLink(updatedPile);
  };
  return {
    LinkBoardPanel,
    setLinkBoardPanelToggle,
    addPile,
    removePile,
    pile,
    handleSignIn,
  };
};
