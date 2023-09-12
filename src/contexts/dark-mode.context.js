import { createContext, useState, useEffect } from "react";

export const DarkModeContext = createContext(false);

export const DarkModeProvider = ({ children }) => {
  const [isDarkModeActive, setDarkModeActive] = useState(false);

  useEffect(()=>{
    const storedPreference = localStorage.getItem('prefersDarkMode');

    if(storedPreference === 'true') {
      setDarkModeActive(true)
    } else {
      setDarkModeActive(false)
    }
},[])

  return (
    <DarkModeContext.Provider value={{ isDarkModeActive, setDarkModeActive }}>
      {children}
    </DarkModeContext.Provider>
  );
};