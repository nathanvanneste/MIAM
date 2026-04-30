import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { ChevronRight, UsersRound, CookingPot } from "lucide-react-native";
import { COLORS } from "../../../constants";

type GroupCardProps = {
  image: string;
  title: string;
  membersCount: number;
  recipesCount: number;
  onPress?: () => void;
};

export default function GroupCard({
  image,
  title,
  membersCount,
  recipesCount,
  onPress,
}: GroupCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={{ uri: image }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        <View style={styles.infoRow}>
          <UsersRound size={20} color={COLORS.textTertiary} />
          <Text style={styles.infoText}>{membersCount} personnes</Text>
        </View>

        <View style={styles.infoRow}>
          <CookingPot size={20} color={COLORS.textTertiary} />
          <Text style={styles.infoText}>{recipesCount} recettes</Text>
        </View>
      </View>

      <ChevronRight size={22} color={COLORS.textTertiary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 100,
    backgroundColor: COLORS.card,
    borderRadius: 23,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 6,
  },

  image: {
    width: 82,
    height: 82,
    borderRadius: 41,
    marginRight: 10,
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 3,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 3,
  },

  infoText: {
    fontSize: 18,
    color: COLORS.textTertiary,
    fontWeight: "500",
  },
});