// app/_layout.tsx
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import Toast from "react-native-toast-message";
import { MacroProvider } from "../contexts/MacroContext"; // ajuste o caminho se necessário

export default function Layout() {
  return (
    <MacroProvider>
      <StatusBar backgroundColor="black" barStyle="light-content" />
      <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack>
      <Toast />
    </MacroProvider>
  );
}
