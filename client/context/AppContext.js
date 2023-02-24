import { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [contextState, setContextState] = useState();

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      sessionStorage.getItem("currentAccount")
    ) {
      updateContextState({
        currentAddress: sessionStorage.getItem("currentAccount"),
      });
    }
  }, [contextState]);

  const updateContextState = (newContext) => {
    setContextState((prevContext) => ({ ...prevContext, newContext }));
  };
  return (
    <AppContext.Provider value={{ contextState, updateContextState }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
