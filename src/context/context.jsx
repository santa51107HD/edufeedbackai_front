import { createContext, useState, useEffect } from "react";

export const Context = createContext({});

export default function ContextProvider({ children }) {
  const [appState, setAppState] = useState(() => {
    const storedState = localStorage.getItem("appState");
    return storedState ? JSON.parse(storedState) : {
      loggedIn: false,
      typeUser: "",
      name: "",
      token: "",
    };
  });

  useEffect(() => {
    localStorage.setItem("appState", JSON.stringify(appState));
  }, [appState]);

  return (
    <Context.Provider value={{ appState, setAppState }}>
      {children}
    </Context.Provider>
  );
}