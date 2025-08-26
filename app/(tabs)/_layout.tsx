import { Tabs } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  const { colors } = useTheme();

  return (
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
        name="diary"
        options={{
          title: "Diário",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="news"
        options={{
          title: "Notícias",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="newspaper" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
