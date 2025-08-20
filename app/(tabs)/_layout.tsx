import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs, router } from "expo-router";
import { View } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarBackground: () => (
          <View style={{ flex: 1, backgroundColor: "#fafbfe" }} />
        ),
        tabBarActiveTintColor: "#0D6EFD",
      }}
    >
      {/* Aba Home */}
      <Tabs.Screen
        name="home"
        options={{
          title: "Início",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={22} name="home" color={color} />
          ),
        }}
      />

      {/* Aba Diário - redireciona para /searchFood */}
      <Tabs.Screen
        name="diary"
        options={{
          title: "Diário",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={22} name="book" color={color} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault(); // bloqueia navegação padrão
            router.push("/searchFood"); // redireciona para searchFood
          },
        }}
      />

      {/* Aba Notícias */}
      <Tabs.Screen
        name="news"
        options={{
          title: "Notícias",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={22} name="bell" color={color} />
          ),
        }}
      />

      {/* Aba Mais */}
      <Tabs.Screen
        name="more"
        options={{
          title: "Mais",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={22} name="bars" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
