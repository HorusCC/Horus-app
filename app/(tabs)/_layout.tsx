// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { MacroProvider } from "../contexts/MacroContext";

type IconProps = {
  color: string;
  size: number;
};

export default function TabsLayout() {
  return (
    <ThemeProvider>
      <MacroProvider>
        <TabsWithTheme />
      </MacroProvider>
    </ThemeProvider>
  );
}

function TabsWithTheme() {
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
        name="home"
        options={{
          title: "Início",
          tabBarIcon: ({ color, size }: IconProps) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="diet"
        options={{
          title: "Dieta",
          tabBarIcon: ({ color, size }: IconProps) => (
            <MaterialIcons name="restaurant" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Pesquisa",
          tabBarIcon: ({ color, size }: IconProps) => (
            <MaterialIcons name="search" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "Mais",
          tabBarIcon: ({ color, size }: IconProps) => (
            <MaterialIcons name="dehaze" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
