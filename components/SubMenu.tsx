// components/BottomTabs.js
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { View } from "react-native";
import { Tabs } from "expo-router";
import { router } from "expo-router";

export function SubMenu() {
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
      <Tabs.Screen
        name="home"
        options={{
          title: "Início",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={22} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="diary"
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push("/searchFood");
          },
        }}
        options={{
          title: "Diário",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={22} name="book" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
