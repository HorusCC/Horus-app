// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";

export default function TabsLayout() {
  const { isDark } = useTheme();

  return (
    <ThemeProvider>
      <Tabs
        screenOptions={{
          headerShown: false, // remove header branco de todas as telas
          tabBarActiveTintColor: "#5692B7",
          tabBarInactiveTintColor: isDark ? "#999" : "#555",
          tabBarStyle: {
            backgroundColor: isDark ? "#000" : "#fff",
            borderTopWidth: 0,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            tabBarIcon: ({ color, size }) => <MaterialIcons name="home" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="diet"
          options={{
            tabBarIcon: ({ color, size }) => <MaterialIcons name="restaurant" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            tabBarIcon: ({ color, size }) => <MaterialIcons name="search" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="more"
          options={{
            tabBarIcon: ({ color, size }) => <MaterialIcons name="menu" size={size} color={color} />,
          }}
        />
      </Tabs>
    </ThemeProvider>
  );
}
