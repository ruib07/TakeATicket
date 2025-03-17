import { TextInput, type TextInputProps, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextAreaProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedTextArea({
  style,
  lightColor,
  darkColor,
  ...rest
}: ThemedTextAreaProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const backgroundColor = useThemeColor({}, "background");

  return (
    <TextInput
      style={[styles.textArea, { color, backgroundColor }, style]}
      placeholderTextColor={color}
      multiline
      numberOfLines={4}
      textAlignVertical="top"
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  textArea: {
    fontSize: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginVertical: 8,
    width: "100%",
    minHeight: 100,
  },
});
