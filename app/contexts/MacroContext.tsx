// app/contexts/MacroContext.tsx
import React, { createContext, useContext, useState } from "react";

const MacroContext = createContext<any>(null);

export const MacroProvider = ({ children }: any) => {
  const [carb, setCarb] = useState(0);
  const [protein, setProtein] = useState(0);
  const [fat, setFat] = useState(0);
  const [kcal, setKcal] = useState(0);

  const addMacros = (c: number, p: number, f: number) => {
    setCarb((prev) => prev + c);
    setProtein((prev) => prev + p);
    setFat((prev) => prev + f);
    setKcal((prev) => prev + (c * 4 + p * 4 + f * 9));
  };

  const resetMacros = () => {
    setCarb(0);
    setProtein(0);
    setFat(0);
    setKcal(0);
  };

  // ✅ recalcula a partir de valores já prontos
  const setMacros = (c: number, p: number, f: number) => {
    setCarb(c);
    setProtein(p);
    setFat(f);
    setKcal(c * 4 + p * 4 + f * 9);
  };

  return (
    <MacroContext.Provider value={{ carb, protein, fat, kcal, addMacros, resetMacros, setMacros }}>
      {children}
    </MacroContext.Provider>
  );
};

export const useMacros = () => useContext(MacroContext);
