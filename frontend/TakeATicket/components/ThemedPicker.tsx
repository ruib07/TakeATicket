import { Picker } from "@react-native-picker/picker";
import { View, StyleSheet, Platform } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedPickerProps = {
  selectedValue: string;
  onValueChange: (itemValue: string) => void;
  items: { label: string; value: string }[];
};

export function ThemedPicker({
  selectedValue,
  onValueChange,
  items,
}: ThemedPickerProps) {
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");

  return (
    <View style={[styles.pickerContainer, { backgroundColor }]}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        dropdownIconColor={textColor}
        mode={Platform.OS === "ios" ? "dropdown" : "dialog"}
      >
        {items.map((item) => (
          <Picker.Item key={item.value} label={item.label} value={item.value} />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginVertical: 8,
    width: "100%",
    overflow: "hidden",
    paddingHorizontal: 4,
    paddingVertical: Platform.OS === "ios" ? 8 : 0,
  },
  picker: {
    width: "100%",
  },
});
