const stored = localStorage.getItem("theme");
if (stored === "dark") {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}
// hooks/useTheme.js
import { useRef, useEffect, useState } from "react";

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  const [isPileVisible, setIsPileVisible] = useState(true);
  const pileRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.style.backgroundColor = "black";
      root.style.color = "white";
    } else {
      root.classList.remove("dark");
      root.style.backgroundColor = "white";
      root.style.color = "black";
    }
  }, [theme]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsPileVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (pileRef.current) {
      observer.observe(pileRef.current);
    }

    return () => {
      if (pileRef.current) {
        observer.unobserve(pileRef.current);
      }
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return { theme, toggleTheme, isPileVisible, pileRef };
}
