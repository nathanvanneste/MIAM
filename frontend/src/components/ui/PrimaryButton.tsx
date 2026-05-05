// src/components/ui/PrimaryButton.tsx
import { Pressable, Text, StyleSheet, ViewStyle, StyleProp } from "react-native";
import { Colors } from "../../constants/colors";
import { FontSize, FontWeight } from "../../constants/typography";

type Props = {
  title: string;
  onPress: () => void;
  backgroundColor?: string;
  textColor?: string;
  style?: StyleProp<ViewStyle>;
};

export default function PrimaryButton({
  title,
  onPress,
  backgroundColor = Colors.primaryButton,
  textColor = Colors.surface,
  style,
}: Props) {
  return (
    <Pressable
      style={[styles.button, { backgroundColor }, style]}
      onPress={onPress}
    >
      <Text style={[styles.text, { color: textColor }]}> {title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 45,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  text: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
});
