import { TextInputProps } from "react-native";

export interface InputProps extends TextInputProps {
    type?: 'default' | 'email-address' | 'password' | 'numeric' | 'phone-pad' | 'decimal-pad' | 'url' | 'visible-password';
    label?: string;
    placeholder?: string;
    mask?: string;
    error?: string;
    disabled?: boolean;
}