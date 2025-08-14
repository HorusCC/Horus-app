import { StyleProp, ViewStyle } from "react-native";

export interface ButtonProps {
    style?: StyleProp<ViewStyle>;
    title: string;
    onPress: () => void;
    colors?: [string, string];
    solidColor?: string;
    disabled?: boolean;
    children?: React.ReactNode;
    icon?: React.ReactNode;
    width?: number;
    height?: number;
    isLoading?: boolean;
    loadingIndicatorColor?: string;
}
