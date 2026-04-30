import { View, Text, Pressable, StyleSheet } from "react-native";
import { Check, Minus, Plus } from "lucide-react-native";
import { COLORS } from "../../../constants";

type SelectableIngredientProps = {
  title: string;
  checked: boolean;
  quantity: number;
  onToggle: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
  color?: string;
};

export default function SelectableQuantityItem({
  title,
  checked,
  quantity,
  onToggle,
  onIncrement,
  onDecrement,
  color = COLORS.primary,
}: SelectableIngredientProps) {
  return (
    <View style={styles.container}>
      <Pressable
        style={[
          styles.checkbox,
          {
            borderColor: color,
            backgroundColor: checked ? color : "transparent",
          },
        ]}
        onPress={onToggle}
      >
        {checked && <Check size={18} color="white" strokeWidth={3} />}
      </Pressable>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      <Pressable
        style={[styles.quantityButton, { borderColor: color }]}
        onPress={onDecrement}
      >
        <Minus size={18} color={color} strokeWidth={3} />
      </Pressable>

      <Text style={styles.quantity}>{quantity}</Text>

      <Pressable
        style={[styles.quantityButton, { borderColor: color }]}
        onPress={onIncrement}
      >
        <Plus size={18} color={color} strokeWidth={3} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 76,
    backgroundColor: COLORS.card,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 22,
  },

  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },

  quantityButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1.5,
    backgroundColor: "#EFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  quantity: {
    width: 42,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
});