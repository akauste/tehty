"use client";
import { DarkMode, LightMode } from "@mui/icons-material";
import { useEffect, useState } from "react";

const DarkModeSwitch = () => {
  const [isDarkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    const handleDarkModeChange = (event: MediaQueryListEvent) => {
      setDarkMode(event.matches);
    };

    darkModeMediaQuery.addEventListener("change", handleDarkModeChange);

    if (darkModeMediaQuery.matches) {
      document.documentElement.style.setProperty("color-scheme", "dark");
      setDarkMode(true);
    }

    return () => {
      darkModeMediaQuery.removeEventListener("change", handleDarkModeChange);
    };
  }, []);

  const darkMode = () => {
    setDarkMode(true);
    document.documentElement.classList.add("dark");
    document.documentElement.style.setProperty("color-scheme", "dark");
  };

  const lightMode = () => {
    setDarkMode(false);
    document.documentElement.classList.remove("dark");
    document.documentElement.style.setProperty("color-scheme", "light");
  };

  return (
    <button className="bg-gray-600 dark:bg-gray-900 p-1 rounded-lg text-xs">
      {isDarkMode ? (
        <DarkMode htmlColor="yellow" onClick={lightMode} />
      ) : (
        <LightMode htmlColor="yellow" onClick={darkMode} />
      )}
    </button>
  );
};
export default DarkModeSwitch;
