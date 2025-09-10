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
      {/* StatusBar coerente com o tema e fundo preto no Android */}
      <StatusBar style={isDark ? "light" : "dark"} backgroundColor="#000" />
      <Stack
        screenOptions={{
          // remove a “tarja” mantendo só o botão de tema flutuando
          headerTransparent: true,
          headerStyle: { backgroundColor: "transparent" },
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
