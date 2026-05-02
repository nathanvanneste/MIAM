// src/components/ui/Recipe/RecipeCard.tsx
// src/constants/colors.ts
import { View, Text, Image, StyleSheet, useWindowDimensions } from "react-native";
import { Clock, Flame } from "lucide-react-native";
import { Colors } from "../../../constants/colors";
import { FontSize } from "../../../constants/typography";
import type { Recipe } from "../../../types/recipe";

type RecipeCardProps = {
  recipe: Recipe;
  color?: string;
  icon?: string;
  cardWidth: number; // ← reçu de la Grid
};

export default function RecipeCard({ recipe, color, icon = "🍽️", cardWidth }: RecipeCardProps) {
  // Plus besoin de useWindowDimensions ni du calcul hardcodé

  const imageSize = Math.min(76, cardWidth * 0.48);

  return (
    <View
      style={[
        styles.card,
        {
          width: cardWidth,
          backgroundColor: color ?? Colors.cardLight,
        },
      ]}
    >
      <Text style={styles.title} numberOfLines={2}>
        {recipe.name}
      </Text>

      <View style={styles.bottomContent}>
        {recipe.photo ? (
          <Image
            source={{ uri: recipe.photo }}
            style={[
              styles.image,
              {
                width: imageSize,
                height: imageSize,
              },
            ]}
          />
        ) : (
          <View
            style={[
              styles.imagePlaceholder,
              {
                width: imageSize,
                height: imageSize,
                backgroundColor: color ?? Colors.cardLight,
              },
            ]}
          >
            <Text style={styles.icon}>{icon}</Text>
          </View>
        )}

        <View style={styles.info}>
          <View style={styles.timeRow}>
            <Clock size={12} color={Colors.textPrimary} />
            <Text style={styles.timeText} numberOfLines={1}>
              {recipe.prepTime}min
            </Text>
          </View>

          <View style={styles.timeRow}>
            <Flame size={12} color={Colors.textPrimary} />
            <Text style={styles.timeText} numberOfLines={1}>
              {recipe.cookTime}min
            </Text>
          </View>

          <Text style={styles.dateText} numberOfLines={1}>
            {recipe.dateCreation.toLocaleDateString("fr-FR")}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    padding: 10,
    marginBottom: 14,
    justifyContent: "flex-start",
  },

  title: {
    fontSize: FontSize.lg,
    lineHeight: 19,
    height: 38,
    fontWeight: "600",
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: 4,
  },

  bottomContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  image: {
    borderRadius: 18,
  },

  imagePlaceholder: {
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    fontSize: FontSize.xxxxl,
  },

  info: {
    flex: 1,
    marginLeft: 6,
    alignItems: "flex-end",
    minWidth: 0,
  },

  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginBottom: 6,
  },

  timeText: {
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },

  dateText: {
    fontSize: FontSize.xxs,
    color: Colors.textPrimary,
    marginTop: 2,
  },
});