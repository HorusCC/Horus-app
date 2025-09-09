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
import { MaskedTextInput } from "react-native-mask-text";
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

  //   const togglePasswordVisibility = () => {
  //     setIsPasswordVisible(!isPasswordVisible);
  //   };

  //   const getKeyboardType = () => {
  //     switch (keyboardType) {
  //       case "email-address":
  //         return "email-address";
  //       case "numeric":
  //         return "number-pad";
  //       case "phone-pad":
  //         return "phone-pad";
  //       case "decimal-pad":
  //         return "decimal-pad";
  //       case "password":
  //         return "default";
  //       case "url":
  //         return "url";
  //       case "visible-password":
  //         return "default";
  //       default:
  //         return "default";
  //     }
  //   };

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
              placeholder="Digite algo..."
              placeholderTextColor={placeholderTextColor || "#999"}
              onBlur={onBlur}
              onChangeText={onChange}
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
  input: {
    width: "auto",
    height: 50,
    borderWidth: 1,
    borderColor: "#0652b4ff",
    backgroundColor: "#F6F6F6",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
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
