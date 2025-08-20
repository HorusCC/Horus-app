// app/contexts/MacroContext.tsx
import React, { createContext, useState, useContext, ReactNode } from "react";

interface MacroContextType {
  carb: number;
  protein: number;
  fat: number;
  kcal: number;
  addMacros: (c: number, p: number, f: number) => void;
  resetMacros: () => void;
}

const MacroContext = createContext<MacroContextType | undefined>(undefined);

export const MacroProvider = ({ children }: { children: ReactNode }) => {
  const [carb, setCarb] = useState(0);
  const [protein, setProtein] = useState(0);
  const [fat, setFat] = useState(0);

  const addMacros = (c: number, p: number, f: number) => {
    setCarb(prev => prev + c);
    setProtein(prev => prev + p);
    setFat(prev => prev + f);
  };

  const resetMacros = () => {
    setCarb(0);
    setProtein(0);
    setFat(0);
  };

  const kcal = carb * 4 + protein * 4 + fat * 9;

  return (
    <MacroContext.Provider value={{ carb, protein, fat, kcal, addMacros, resetMacros }}>
      {children}
    </MacroContext.Provider>
  );
};

export const useMacros = () => {
  const context = useContext(MacroContext);
  if (!context) throw new Error("useMacros must be used within a MacroProvider");
  return context;
};
