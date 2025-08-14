import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { View } from "react-native";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarBackground: () => <View style={{ flex: 1, backgroundColor: "#fafbfe" }} />, tabBarActiveTintColor: '#0D6EFD' }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => <FontAwesome size={22} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="diary"
        options={{
          title: 'Diário',
          tabBarIcon: ({ color }) => <FontAwesome size={22} name="book" color={color} />,
        }}
      />
      <Tabs.Screen
        name="news"
        options={{
          title: 'Notícias',
          tabBarIcon: ({ color }) => <FontAwesome size={22} name="bell" color={color} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'Mais',
          tabBarIcon: ({ color }) => <FontAwesome size={22} name="bars" color={color} />,
        }}
      />
    </Tabs>
  );
}
