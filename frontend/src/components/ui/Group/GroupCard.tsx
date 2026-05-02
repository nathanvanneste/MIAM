// src/components/ui/Group/GroupCard.tsx
import { View, Text, Image, StyleSheet, Pressable, useWindowDimensions } from "react-native";
import { ChevronRight, UsersRound, CookingPot } from "lucide-react-native";
import { Colors } from "../../../constants/colors";
import { FontSize, FontWeight } from "../../../constants/typography";

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
  const { width } = useWindowDimensions();

  const imageSize = Math.round(width * 0.2);  // ~20% de la largeur écran
  const cardHeight = Math.round(imageSize * 1.2);

  return (
    <Pressable
      style={[styles.card, { height: cardHeight }]}
      onPress={onPress}
    >
      <Image
        source={{ uri: image }}
        style={[
          styles.image,
          {
            width: imageSize,
            height: imageSize,
            borderRadius: imageSize / 2,
          },
        ]}
      />

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        <View style={styles.infoRow}>
          <UsersRound size={18} color={Colors.primaryMuted} />
          <Text style={styles.infoText}>{membersCount} personnes</Text>
        </View>

        <View style={styles.infoRow}>
          <CookingPot size={18} color={Colors.primaryMuted} />
          <Text style={styles.infoText}>{recipesCount} recettes</Text>
        </View>
      </View>

      <ChevronRight size={22} color={Colors.primaryMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 23,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },

  image: {
    marginRight: 12,
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: 3,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 4,
  },

  infoText: {
    fontSize: FontSize.lg,
    color: Colors.primaryMuted,
    fontWeight: FontWeight.medium,
  },
});
