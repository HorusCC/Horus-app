import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeToggleButton() {
  const { isDark, toggleTheme, colors } = useTheme();
  return (
    <Pressable
      onPress={toggleTheme}
      style={{ paddingHorizontal: 12, paddingVertical: 6 }}
    >
      <Ionicons
        name={isDark ? "sunny" : "moon"}
        size={22}
        color={colors.text}
      />
    </Pressable>
  );
}
