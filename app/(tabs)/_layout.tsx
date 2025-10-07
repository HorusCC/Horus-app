// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import { ThemeProvider } from "../contexts/ThemeContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function TabsLayout() {
  const { colors } = useTheme();
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Tabs
          screenOptions={{
            headerTitle: "",
            headerShown: false,
            tabBarStyle: { backgroundColor: colors.background },
            tabBarActiveTintColor: colors.text,
            tabBarInactiveTintColor: colors.text,
          }}
        >
          <Tabs.Screen
            name="home"
            options={{
              title: "Início",
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="home" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="diet"
            options={{
              title: "Dieta",
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="restaurant" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="search"
            options={{
              title: "Pesquisa",
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="search" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="more"
            options={{
              title: "Mais",
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="dehaze" size={size} color={color} />
              ),
            }}
          />
        </Tabs>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
