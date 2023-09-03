import { createContext, useState } from "react";

export const DarkModeContext = createContext(false);

export const DarkModeProvider = ({ children }) => {
  const [isDarkModeActive, setDarkModeActive] = useState(false);

  return (
    <DarkModeContext.Provider value={{ isDarkModeActive, setDarkModeActive }}>
      {children}
    </DarkModeContext.Provider>
  );
};