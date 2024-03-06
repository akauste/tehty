'use client';
import { DarkMode, LightMode } from "@mui/icons-material";
import { useEffect, useState } from "react";

const DarkModeSwitch = () => {
  const [mode, setMode] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleDarkModeChange = (event: MediaQueryListEvent) => {
      setMode(event.matches ? 'dark' : 'light');
    };

    darkModeMediaQuery.addEventListener('change', handleDarkModeChange);

    if(darkModeMediaQuery.matches) {
      document.documentElement.style.setProperty('color-scheme', 'dark');
      setMode('dark');
    }

    return () => {
      darkModeMediaQuery.removeEventListener('change', handleDarkModeChange);
    };
  }, []);

  const darkMode = () => {
    setMode('dark');
    document.documentElement.style.setProperty('color-scheme', 'dark');
  }

  const lightMode = () => {
    setMode('light');
    document.documentElement.style.setProperty('color-scheme', 'light');
  }

  return <button className="bg-gray-900 p-1 rounded-lg text-xs">
    { mode == 'light' ? 
      <DarkMode htmlColor="yellow" onClick={darkMode} /> : 
      <LightMode htmlColor="yellow" onClick={lightMode} /> }
  </button>
}
export default DarkModeSwitch;