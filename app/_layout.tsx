// app/_layout.tsx
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import ThemeToggleButton from "@/components/ThemeToggleButton";

/** Componente de StatusBar que respeita o tema.
 *  É definido aqui no MESMO ARQUIVO, não é outra pasta/arquivo.
 */
function ThemedStatusBar() {
  const { isDark } = useTheme();
  return <StatusBar style={isDark ? "light" : "dark"} />;
}

/** Navigator raiz com header temático e o botão no headerRight.
 *  Também é um componente definido no MESMO ARQUIVO, só para organizar.
 */
function StackNavigator() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerRight: () => <ThemeToggleButton />,
        animation: "slide_from_right",
      }}
    >
      {/* Grupo de Tabs (usa o header próprio do arquivo (tabs)/_layout.tsx) */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Telas fora das tabs (com header e botão) */}
      <Stack.Screen name="index" options={{ title: "Início" }} />
      <Stack.Screen name="login" options={{ title: "Login" }} />
      <Stack.Screen name="register" options={{ title: "Cadastro" }} />
    </Stack>
  );
}

export default function Layout() {
  return (
    <ThemeProvider>
      <ThemedStatusBar />
      <StackNavigator />
      <Toast />
    </ThemeProvider>
  );
}
