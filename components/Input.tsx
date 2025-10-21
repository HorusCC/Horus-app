import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardTypeOptions,
} from "react-native";
import { Controller } from "react-hook-form";
import { MaterialIcons } from "@expo/vector-icons";

interface InputProps {
  name: string;
  control: any;
  placeholder?: string;
  rules?: object;
  error?: string;
  color?: string;
  keyboardType?: KeyboardTypeOptions;
  style?: object;
  type?: "text" | "password" | "email" | "number";
  placeholderTextColor?: string;
  value?: string;
  secureTextEntry?: boolean;
  onChangeText?: (text: string) => void;
}

export function Input({
  name,
  control,
  placeholder,
  rules,
  error,
  keyboardType,
  style,
  type,
  placeholderTextColor,
  value,
  secureTextEntry,
  onChangeText,
}: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <MaterialIcons size={25} color="#5692B7" style={styles.icon} />
            <TextInput
              placeholder={placeholder}
              placeholderTextColor={placeholderTextColor || "#999"}
              onBlur={onBlur}
              onChangeText={onChange}
              style={[style, { style }]}
              value={value}
              keyboardType="default"
              secureTextEntry={secureTextEntry}
            />
          </>
        )}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 3,
  },
  label: {
    marginBottom: 4,
  },
  inputContainer: {
    position: "relative",
  },
  inputError: {
    borderColor: "red",
  },
  inputDisabled: {
    backgroundColor: "#D3D3D3",
    color: "#A9A9A9",
  },
  icon: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 4,
  },
});
