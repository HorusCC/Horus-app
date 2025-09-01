import React, { createContext, useContext, useState } from "react";

const MacroContext = createContext<any>(null);

export const MacroProvider = ({ children }: any) => {
  const [carb, setCarb] = useState(0);
  const [protein, setProtein] = useState(0);
  const [fat, setFat] = useState(0);

  const addMacros = (c: number, p: number, f: number) => {
    setCarb((prev: number) => Math.max(0, prev + c));
    setProtein((prev: number) => Math.max(0, prev + p));
    setFat((prev: number) => Math.max(0, prev + f));
  };

  const resetMacros = () => {
    setCarb(0);
    setProtein(0);
    setFat(0);
  };

  return (
    <MacroContext.Provider value={{ carb, protein, fat, addMacros, resetMacros }}>
      {children}
    </MacroContext.Provider>
  );
};

export const useMacros = () => useContext(MacroContext);
