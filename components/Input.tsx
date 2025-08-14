import { InputProps } from "@/Interfaces/Input";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { MaskedTextInput } from "react-native-mask-text";

export function Input({
    type,
    label,
    placeholder,
    mask,
    value,
    onChangeText,
    onBlur,
    error,
    disabled,
    ...props
}: InputProps) {
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const getKeyboardType = () => {
        switch (type) {
            case 'email-address':
                return 'email-address';
            case 'numeric':
                return 'number-pad';
            case 'phone-pad':
                return 'phone-pad';
            case 'decimal-pad':
                return 'decimal-pad';
            case 'password':
                return 'default';
            case 'url':
                return 'url';
            case 'visible-password':
                return 'default';
            default:
                return 'default';
        }
    };

    return (
        <View style={styles.container}>
            {label && <Text className="text-lg font-inter-semibold"
                style={styles.label}>{label}</Text>}
            <View style={styles.inputContainer}>
                {mask ? (
                    <MaskedTextInput
                        className="font-inter-medium"
                        mask={mask}
                        style={[styles.input, error ? styles.inputError : null, disabled ? styles.inputDisabled : null]}
                        placeholder={placeholder}
                        value={value}
                        onChangeText={(text, rawText) => onChangeText && onChangeText(text)}
                        onBlur={onBlur}
                        editable={!disabled}
                        {...props}
                    />
                ) : (
                    <TextInput
                        className="font-inter-medium"
                        keyboardType={getKeyboardType()}
                        style={[styles.input, error ? styles.inputError : null, disabled ? styles.inputDisabled : null]}
                        placeholder={placeholder}
                        secureTextEntry={type === "password" && !isPasswordVisible}
                        value={value}
                        onChangeText={onChangeText}
                        onBlur={onBlur}
                        editable={!disabled}
                        multiline={false}
                        {...props}
                    />
                )}

                {type === "password" && !disabled && (
                    <TouchableOpacity onPress={togglePasswordVisibility} style={styles.icon}>
                        <Ionicons name={isPasswordVisible ? "eye-off" : "eye"} size={24} color="gray" />
                    </TouchableOpacity>
                )}
            </View>

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