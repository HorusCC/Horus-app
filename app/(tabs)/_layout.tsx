// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import { ThemeProvider } from "../contexts/ThemeContext";

export default function TabsLayout() {
  const { colors } = useTheme();

  return (
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
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="diet"
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="restaurant" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="search" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="person" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </ThemeProvider>
  );
}
