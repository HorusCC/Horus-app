import { Stack } from "expo-router";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import { StatusBar } from "expo-status-bar";
import { MacroProvider } from "@/contexts/macroContext";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <MacroProvider>
          <MainLayout />
        </MacroProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

function MainLayout() {
  const { isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} backgroundColor="#000" />
      <Stack
        screenOptions={{
          headerTransparent: true,
          headerStyle: { backgroundColor: "#00000000" },
          headerShadowVisible: false,
          headerTitle: "",
          headerRight: () => <ThemeToggleButton />,
          contentStyle: { backgroundColor: isDark ? "#000" : "#fff" },
        }}
      />
    </>
  );
}
