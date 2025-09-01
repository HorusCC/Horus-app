// app/_layout.tsx
import { Stack } from "expo-router";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import { StatusBar } from "expo-status-bar";
import { MacroProvider } from "./contexts/MacroContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <MacroProvider>
        <MainLayout />
      </MacroProvider>
    </ThemeProvider>
  );
}

function MainLayout() {
  const { isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerRight: () => <ThemeToggleButton />,
          headerTitle: "",
        }}
      />
    </>
  );
}
