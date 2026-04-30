import { View, StyleSheet, ViewStyle, StyleProp } from "react-native";

type GridProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default function Grid({ children, style }: GridProps) {
  return <View style={[styles.grid, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
});