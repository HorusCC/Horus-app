export interface SelectProps {
    label?: string;
    options: { label: string; value: string }[];
    selectedValue: string;
    onValueChange: (value: string) => void;
    error?: string;
    editable?: boolean;
    value?: string;
}