import { createContext, useState } from "react";

export const ReservationContext = createContext(false);

export const ReservationProvider = ({ children }) => {
	const [isReasrvartionPage, setIsReasrvartionPage] = useState(false);

	return <ReservationContext.Provider value={{isReasrvartionPage, setIsReasrvartionPage}}>{children}</ReservationContext.Provider>;
};