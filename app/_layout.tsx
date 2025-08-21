import { Stack } from "expo-router";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <MainLayout />
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
        }}
      />
    </>
  );
}
