// src/components/ui/PrimaryButton.tsx
import { Pressable, Text, StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";
import { FontSize, FontWeight } from "../../constants/typography";

type Props = {
  title: string;
  onPress: () => void;
  backgroundColor?: string;
  textColor?: string;
};

export default function PrimaryButton({
  title,
  onPress,
  backgroundColor = Colors.primaryButton,
  textColor = Colors.surface,
}: Props) {
  return (
    <Pressable
      style={[styles.button, { backgroundColor }]}
      onPress={onPress}
    >
      <Text style={[styles.text, { color: textColor }]}>
        {title}
      </Text>
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
