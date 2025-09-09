import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  KeyboardTypeOptions,
  FlatList,
} from "react-native";
import { Controller } from "react-hook-form";
import { Feather } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";

interface OptionsProps {
  label: string;
  value: string | number;
}
interface SelectProps {
  name: string;
  control: any;
  placeholder?: string;
  error?: string;
  style?: object;
  placeholderTextColor?: string;
  options: OptionsProps[];
}

export function Select({
  name,
  control,
  placeholder,
  error,
  style,
  placeholderTextColor,
  options,
}: SelectProps) {
  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <TouchableOpacity style={styles.select}>
              <Text>Selecione algo...</Text>
              <Feather name="arrow-down" size={16} color={"#000"} />
            </TouchableOpacity>

            <Modal
              visible={true}
              animationType="fade"
              onRequestClose={() => {}}
              transparent={true}
            >
              <TouchableOpacity style={styles.modalContainer} activeOpacity={1}>
                <TouchableOpacity style={styles.modalContent}>
                  <FlatList
                    contentContainerStyle={{ gap: 4 }}
                    data={options}
                    keyExtractor={(item) => item.value.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity style={styles.option}>
                        <Text>{item.label}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            </Modal>
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
  select: {
    flexDirection: "row",
    height: 44,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  modalContainer: {
    backgroundColor: "rgba(0,0,0,0.5)",
    flex: 1,
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: "white",
    marginHorizontal: 10,
    borderRadius: 8,
    padding: 20,
  },
  option: {
    paddingVertical: 14,
    backgroundColor: "rgba(208,208,208,0.40)",
    borderRadius: 4,
    paddingHorizontal: 8,
  },
});
