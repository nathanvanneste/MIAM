// src/components/ui/PrimaryButton.tsx

import { Pressable, Text, StyleSheet } from "react-native";

type Props = {
  title: string;
  onPress: () => void;
  backgroundColor?: string;
  textColor?: string;
};

export default function PrimaryButton({
  title,
  onPress,
  backgroundColor = "#F4A23A",
  textColor = "white",
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
    fontSize: 18,
    fontWeight: "700",
  },
});