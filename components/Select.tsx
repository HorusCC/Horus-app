import { SelectProps } from "@/Interfaces/Select";
import { Picker } from "@react-native-picker/picker";
import React from "react";
import { ActionSheetIOS, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function Select({ label, options = [], selectedValue, onValueChange, error }: SelectProps) {
    const showActionSheet = () => {
        if (!options?.length) return;

        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: ["Cancelar", ...options.map((opt) => opt.label)],
                cancelButtonIndex: 0,
            },
            (buttonIndex) => {
                if (buttonIndex > 0) {
                    onValueChange(options[buttonIndex - 1].value);
                }
            }
        );
    };

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}

            {Platform.OS === "ios" ? (
                <TouchableOpacity
                    style={[styles.selectBox, error && styles.selectBoxError]}
                    onPress={showActionSheet}
                >
                    <Text style={[styles.selectedText, !selectedValue && styles.placeholderText]}>
                        {selectedValue
                            ? options.find((opt) => opt.value === selectedValue)?.label
                            : "Selecione uma opção"}
                    </Text>
                </TouchableOpacity>
            ) : (
                <View style={[styles.selectBox, error && styles.selectBoxError]}>
                    <Picker
                        selectedValue={selectedValue}
                        onValueChange={onValueChange}
                        style={styles.picker}
                    >
                        <Picker.Item label="Selecione uma opção" value="" enabled={false} />
                        {options?.map((option) => (
                            <Picker.Item
                                key={option?.value || option?.label}
                                label={option?.label}
                                value={option?.value}
                            />
                        ))}
                    </Picker>
                </View>
            )}

            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        marginBottom: 16,
    },
    label: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 4,
    },
    selectBox: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#E8E8E8",
        backgroundColor: "#F6F6F6",
        borderRadius: 8,
        padding: Platform.OS === "ios" ? 12 : 0,
        fontSize: 16,
    },
    selectBoxError: {
        borderColor: "red",
    },
    selectedText: {
        fontSize: 16,
        color: "#333",
    },
    placeholderText: {
        color: "#A9A9A9",
    },
    picker: {
        width: "100%",
    },
    errorText: {
        color: "red",
        fontSize: 14,
        marginTop: 4,
    },
});
