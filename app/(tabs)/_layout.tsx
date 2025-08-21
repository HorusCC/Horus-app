import { Tabs } from "expo-router";
import ThemeToggleButton from "../../components/ThemeToggleButton";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Início",
          tabBarIcon: ({ color, size }) => <></>,
          headerRight: () => <ThemeToggleButton />,
        }}
      />
      <Tabs.Screen
        name="diary"
        options={{
          title: "Diário",
          headerRight: () => <ThemeToggleButton />,
        }}
      />
      <Tabs.Screen
        name="news"
        options={{
          title: "Notícias",
          headerRight: () => <ThemeToggleButton />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "Mais",
          headerRight: () => <ThemeToggleButton />,
        }}
      />
    </Tabs>
  );
}
