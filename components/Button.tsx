import { ButtonProps } from "@/Interfaces/Button";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export function Button({
  style,
  title,
  onPress,
  colors,
  solidColor,
  disabled = false,
  icon,
  width,
  height,
  isLoading = false,
}: ButtonProps) {
  const defaultColor = "#0057C9";
  const backgroundColor = solidColor || defaultColor;

  const handlePress = () => {
    if (!disabled && !isLoading) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      style={[
        styles.button,
        { backgroundColor, width, height },
        disabled && styles.disabled,
        style,
      ]}
      disabled={disabled || isLoading}
    >
      <View style={styles.contentContainer}>
        {icon && <View style={styles.icon}>{icon}</View>}
        {isLoading ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <Text style={styles.text}>{title}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 150,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 15,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  disabled: {
    opacity: 0.6,
  },
});
