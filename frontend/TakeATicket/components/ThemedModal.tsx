import { StyleSheet } from "react-native";
import ModalSelector from "react-native-modal-selector";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedModalProps = {
  selectedValue: string;
  onValueChange: (itemValue: string) => void;
  items: { label: string; value: string }[];
};

export function ThemedModal({
  selectedValue,
  onValueChange,
  items,
}: ThemedModalProps) {
  const itemsWithKey = items.map((item) => ({
    ...item,
    key: item.value,
  }));
  const backgroundColor = useThemeColor({}, "background");

  return (
    <ThemedView style={styles.container}>
      <ModalSelector
        data={itemsWithKey}
        initValue={selectedValue}
        onChange={(option) => onValueChange(option.value)}
        cancelText="Cancel"
      >
        <ThemedView
          style={[styles.selectedValue, { backgroundColor: backgroundColor }]}
        >
          <ThemedText>{selectedValue || "Select..."}</ThemedText>
        </ThemedView>
      </ModalSelector>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 10,
  },
  selectedValue: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});
