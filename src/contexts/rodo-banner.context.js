import { createContext, useState } from "react";

export const RodoContext = createContext(false);

export const RodoProvider = ({ children }) => {
  const [isRodoAccepted, setIsRodoAccepted] = useState(false);

  return (
    <RodoContext.Provider value={{ isRodoAccepted, setIsRodoAccepted }}>
      {children}
    </RodoContext.Provider>
  );
};
