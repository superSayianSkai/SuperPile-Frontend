import { useState, useEffect } from "react";
import { v4 as uuidV4 } from "uuid";
import { useRef } from "react";
const State = () => {
  const [LinkBoardPanel, setLinkBoardPanel] = useState(false);
  const [hostName, getHostName] = useState("");
  const [hostNameSentence, getHostNameSentence] = useState("");
  const [metaLink, setMetaLink] = useState("");
  const [categoryState,setCategoryState]=useState("")
  const[tick,setTick]=useState("all") 
  const categoryRef =useRef()

  console.log(categoryRef)
  const setLinkBoardPanelToggle = () => {
    setLinkBoardPanel((prev) => !prev);
  };
  const setTheMetaLink = (e) => {
    setMetaLink(e);
  };
  const setTheCategoryState=()=>{
    setCategoryState(prev=>!prev)
  }
  const setTheTick=(cat)=>{
    console.log(cat)
    setTick(cat)
  }
  const modifyTheHostName = (url) => {
    const hostNameSentence = new URL(url).hostname;
    const hostname = hostNameSentence?.split(".")[0];
    getHostName(hostname);
    getHostNameSentence("from" + " " + hostNameSentence);
  };

  const getStoredPile = () => {
    const storedData = localStorage.getItem("pile");
    if (storedData) {
      try {
        return JSON.parse(storedData);
      } catch (error) {
        console.error("Failed to parse stored data:", error);
        return [];
      }
    }
    return [];
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

  useEffect(() => {
    localStorage.setItem("pile", JSON.stringify(pile));
  }, [pile]);

  const removePile = (newLink) => {
    const updatedPile = pile.filter((item) => item.id !== newLink.id);
    setPileLink(updatedPile);
  };
  return {
    addPile,
    removePile,
    LinkBoardPanel,
    setLinkBoardPanelToggle,
    modifyTheHostName,
    pile,
    metaLink,
    setTheMetaLink,
    hostName,
    hostNameSentence,
    setTheCategoryState,
    categoryState,
    categoryRef,
    tick,
    setTheTick
  };
};

export default State;
