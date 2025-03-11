import { TextInput, type TextInputProps, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedInput({
  style,
  lightColor,
  darkColor,
  ...rest
}: ThemedInputProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const backgroundColor = useThemeColor({}, "background");

  return (
    <TextInput
      style={[styles.input, { color, backgroundColor }, style]}
      placeholderTextColor={color}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    fontSize: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginVertical: 8,
    width: "100%",
  },
});
