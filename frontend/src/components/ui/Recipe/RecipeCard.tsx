// src/components/ui/RecipeCard.tsx

import { View, Text, Image, StyleSheet } from "react-native";
import { Clock, Flame } from "lucide-react-native";
import { COLORS } from "../../../constants";
import type { Recipe } from "../../../types/recipe";

type RecipeCardProps = {
  recipe: Recipe;
  color?: string;
  icon?: string;
};

export default function RecipeCard({
  recipe,
  color,
  icon = "🍽️",
}: RecipeCardProps) {
  return (
    <View style={[styles.card, { backgroundColor: color ?? COLORS.card }]}>
      <Text style={styles.title} numberOfLines={2}>
        {recipe.name}
      </Text>

      <View style={styles.bottomContent}>
        {recipe.photo ? (
          <Image source={{ uri: recipe.photo }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.icon}>{icon}</Text>
          </View>
        )}

        <View style={styles.info}>
          <View style={styles.timeRow}>
            <Clock size={14} color={COLORS.textPrimary} />
            <Text style={styles.timeText}>{recipe.prepTime}min</Text>
          </View>

          <View style={styles.timeRow}>
            <Flame size={14} color={COLORS.textPrimary} />
            <Text style={styles.timeText}>{recipe.cookTime}min</Text>
          </View>

          <Text style={styles.dateText}>
            {recipe.dateCreation.toLocaleDateString("fr-FR")}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    height: 135,
    borderRadius: 22,
    padding: 10,
    marginBottom: 14,
    justifyContent: "flex-start", 
    },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: 6,
  },

  bottomContent: {
    flexDirection: "row",
    alignItems: "center", // 👈 au lieu de flex-end
    justifyContent: "space-between",
  },

  image: {
    width: 86,
    height: 86,
    borderRadius: 18,
  },

  imagePlaceholder: {
    width: 86,
    height: 86,
    borderRadius: 18,
    backgroundColor: COLORS.secondaryBackground,
    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    fontSize: 42,
  },

  info: {
    flex: 1,
    marginLeft: 8,
    alignItems: "flex-end",
  },

  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
    marginBottom: 8,
  },

  timeText: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },

  dateText: {
    fontSize: 11,
    color: COLORS.textPrimary,
    marginTop: 4,
  },
});