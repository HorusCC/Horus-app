// contexts/ThemeContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "@/constants/Colors";

type Theme = "light" | "dark";
type ThemeContextValue = {
  theme: Theme;
  isDark: boolean;
  colors: typeof Colors.light;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  // carrega preferencia salva ou usa o sistema na 1ª vez
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("@theme");
      if (saved === "light" || saved === "dark") {
        setTheme(saved);
      } else {
        const sys = Appearance.getColorScheme();
        setTheme(sys === "dark" ? "dark" : "light");
      }
    })();
  }, []);

  // persiste sempre que mudar
  useEffect(() => {
    AsyncStorage.setItem("@theme", theme).catch(() => {});
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === "dark",
      colors: theme === "dark" ? Colors.dark : Colors.light,
      toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
      setTheme,
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx)
    throw new Error("useTheme deve ser usado dentro de <ThemeProvider>");
  return ctx;
}
