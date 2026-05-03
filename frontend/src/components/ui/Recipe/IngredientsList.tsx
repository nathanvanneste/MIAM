// src/components/ui/Recipe/IngredientsList.tsx
import { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Minus, Plus, Tag, Pencil, Trash2 } from "lucide-react-native";
import { Colors } from "@/src/constants/colors";
import { FontSize, FontWeight } from "@/src/constants/typography";
import { RecipeIngredient } from "@/src/types/recipeIngredient";
import IngredientFormSheet from "./IngredientFormSheet";

type IngredientsListProps = {
  ingredients: RecipeIngredient[];
  basePortions: number;
  portions: number;
  categories: string[];
  onIncrement: () => void;
  onDecrement: () => void;
  // Edit callbacks — if undefined, edit mode is not available
  onAddIngredient?: (data: { name: string; quantity: number; unit: string }) => void;
  onEditIngredient?: (index: number, data: { name: string; quantity: number; unit: string }) => void;
  onDeleteIngredient?: (index: number) => void;
};

export default function IngredientsList({
  ingredients,
  basePortions,
  portions,
  categories,
  onIncrement,
  onDecrement,
  onAddIngredient,
  onEditIngredient,
  onDeleteIngredient,
}: IngredientsListProps) {
  const ratio = portions / basePortions;

  const scaled = ingredients.map((ing) => ({
    ...ing,
    quantity: Math.round(ing.quantity * ratio * 10) / 10,
  }));

  const isEditable = !!(onAddIngredient || onEditIngredient || onDeleteIngredient);

  // Sheet state
  const [sheetVisible, setSheetVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const openAdd = () => {
    setEditingIndex(null);
    setSheetVisible(true);
  };

  const openEdit = (index: number) => {
    setEditingIndex(index);
    setSheetVisible(true);
  };

  const handleSheetSave = (data: { name: string; quantity: number; unit: string }) => {
    if (editingIndex !== null) {
      onEditIngredient?.(editingIndex, data);
    } else {
      onAddIngredient?.(data);
    }
  };

  return (
    <View>
      {/* Portions selector */}
      <View style={styles.portionsRow}>
        <View style={styles.portionsSelector}>
          <Pressable onPress={onDecrement} style={styles.portionButton} hitSlop={8}>
            <Minus size={16} color={Colors.textPrimary} strokeWidth={2.5} />
          </Pressable>
          <Text style={styles.portionsText}>{portions} personnes</Text>
          <Pressable onPress={onIncrement} style={styles.portionButton} hitSlop={8}>
            <Plus size={16} color={Colors.textPrimary} strokeWidth={2.5} />
          </Pressable>
        </View>
      </View>

      {/* Add button */}
      {isEditable && (
        <Pressable
          style={({ pressed }) => [styles.addButton, pressed && styles.addButtonPressed]}
          onPress={openAdd}
        >
          <Plus size={16} color={Colors.primaryButton} strokeWidth={2.5} />
          <Text style={styles.addButtonText}>Ajouter un ingrédient</Text>
        </Pressable>
      )}

      {/* Section title */}
      <Text style={styles.sectionTitle}>Ingrédients</Text>

      {/* Ingredients list */}
      <View style={styles.list}>
        {scaled.map((ing, index) => (
          <View key={index} style={styles.row}>
            {/* Quantity */}
            <Text style={styles.quantity}>
              {ing.quantity > 0 ? ing.quantity : ""}
            </Text>

            {/* Unit + Name */}
            <Text style={styles.ingredientText} numberOfLines={1}>
              {ing.unit?.type ? `${ing.unit.type} ` : ""}
              {ing.ingredient.name}
            </Text>

            {/* Edit actions */}
            {isEditable && (
              <View style={styles.actions}>
                <Pressable
                  onPress={() => openEdit(index)}
                  hitSlop={8}
                  style={styles.actionButton}
                >
                  <Pencil size={16} color={Colors.primaryMuted} />
                </Pressable>
                <Pressable
                  onPress={() => onDeleteIngredient?.(index)}
                  hitSlop={8}
                  style={styles.actionButton}
                >
                  <Trash2 size={16} color={Colors.error} />
                </Pressable>
              </View>
            )}

            {/* Read-only bullet */}
            {!isEditable && (
              <>
                <View style={styles.spacer} />
                <View style={styles.bullet} />
              </>
            )}
          </View>
        ))}
      </View>

      {/* Categories */}
      {categories.length > 0 && (
        <View style={styles.categoriesSection}>
          <Text style={styles.categoriesLabel}>Catégorie :</Text>
          <View style={styles.categoriesRow}>
            {categories.map((cat) => (
              <View key={cat} style={styles.categoryTag}>
                <Tag size={13} color={Colors.surface} />
                <Text style={styles.categoryText}>{cat}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Bottom sheet */}
      <IngredientFormSheet
        visible={sheetVisible}
        ingredient={editingIndex !== null ? ingredients[editingIndex] : undefined}
        onClose={() => setSheetVisible(false)}
        onSave={handleSheetSave}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  portionsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  portionsSelector: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    borderWidth: 1.5,
    borderColor: Colors.primaryMuted,
    borderRadius: 30,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 14,
  },

  portionButton: {
    padding: 2,
  },

  portionsText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
  },

  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1.5,
    borderColor: Colors.primaryButton,
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 20,
  },

  addButtonPressed: {
    backgroundColor: Colors.cardLight,
  },

  addButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.primaryButton,
  },

  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: 10,
  },

  list: {
    gap: 2,
    marginBottom: 28,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    marginBottom: 6,
    gap: 8,
  },

  quantity: {
    width: 28,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    textAlign: "right",
  },

  ingredientText: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    lineHeight: 22,
  },

  actions: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },

  actionButton: {
    padding: 2,
  },

  spacer: {
    flex: 1,
  },

  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.textPrimary,
  },

  categoriesSection: {
    gap: 10,
  },

  categoriesLabel: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontWeight: FontWeight.medium,
  },

  categoriesRow: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },

  categoryTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },

  categoryText: {
    fontSize: FontSize.sm,
    color: Colors.surface,
    fontWeight: FontWeight.medium,
  },
});
