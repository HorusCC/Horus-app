// app/_layout.tsx
import { Stack } from "expo-router";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import { StatusBar } from "expo-status-bar";
import { MacroProvider } from "./contexts/MacroContext";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

export default function RootLayout() {
  const queryClient = new QueryClient();

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
      {/* StatusBar coerente com o tema e fundo preto no Android */}
      <StatusBar style={isDark ? "light" : "dark"} backgroundColor="#000" />
      <Stack
        screenOptions={{
          // remove a “tarja” mantendo só o botão de tema flutuando
          headerTransparent: true,
          headerStyle: { backgroundColor: "#00000000" },
          headerShadowVisible: false,
          headerTitle: "",
          headerRight: () => <ThemeToggleButton />,

          // garante que o fundo atrás de tudo é preto no modo dark
          contentStyle: { backgroundColor: isDark ? "#000" : "#fff" },
        }}
      />
    </>
  );
}
