// src/components/ui/Recipe/IngredientFormSheet.tsx
import { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  FlatList,
} from "react-native";
import { X, Search, ChevronDown } from "lucide-react-native";
import { Colors } from "../../../constants/colors";
import { FontSize, FontWeight } from "../../../constants/typography";
import { RecipeIngredient } from "../../../types/recipeIngredient";
import { Ingredient } from "../../../types/ingredient";
import { searchIngredients } from "../../../services/ingredients.service";
import { UNITS } from "../../../constants/units";

export type IngredientFormData = {
  ingredientID: number;
  name: string;
  quantity: number;
  unitID: number;
  unit: string;
};

type IngredientFormSheetProps = {
  visible: boolean;
  ingredient?: RecipeIngredient;
  onClose: () => void;
  onSave: (data: IngredientFormData) => void;
};

export default function IngredientFormSheet({
  visible,
  ingredient,
  onClose,
  onSave,
}: IngredientFormSheetProps) {
  const isEdit = !!ingredient;

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<Ingredient[]>([]);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [unitID, setUnitID] = useState<number>(1);
  const [showUnitPicker, setShowUnitPicker] = useState(false);

  useEffect(() => {
    if (visible) {
      setSearch(ingredient?.ingredient?.name ?? "");
      setSelectedIngredient(ingredient?.ingredient ?? null);
      setQuantity(ingredient?.quantity ? String(ingredient.quantity) : "");
      setUnit(ingredient?.unit?.type ?? "");
      setUnitID(ingredient?.unitID ?? 1);
      setSuggestions([]);
      setShowUnitPicker(false);
    }
  }, [visible, ingredient]);

  const handleSearch = async (text: string) => {
    setSearch(text);
    setSelectedIngredient(null);
    if (text.length < 1) {
      setSuggestions([]);
      return;
    }
    try {
      const results = await searchIngredients(text);
      setSuggestions(results);
    } catch {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (ing: Ingredient) => {
    setSelectedIngredient(ing);
    setSearch(ing.name);
    setSuggestions([]);
    const defaultUnit = UNITS.find((u) => u.type === ing.unitDefault);
    if (defaultUnit) {
      setUnit(defaultUnit.type);
      setUnitID(defaultUnit.unitID);
    }
  };

  const handleSelectUnit = (u: { unitID: number; type: string }) => {
    setUnit(u.type);
    setUnitID(u.unitID);
    setShowUnitPicker(false);
  };

  const handleSave = () => {
    if (!selectedIngredient) return;
    onSave({
      ingredientID: selectedIngredient.ingredientID,
      name: selectedIngredient.name,
      quantity: parseFloat(quantity) || 0,
      unitID,
      unit,
    });
    onClose();
  };

  const canSave = !!selectedIngredient;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.sheetWrapper}
      >
        <View style={styles.sheet}>
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>
              {isEdit ? "Modifier un ingrédient" : "Ajouter un ingrédient"}
            </Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <X size={22} color={Colors.textPrimary} />
            </Pressable>
          </View>

          {/* Search */}
          <Text style={styles.label}>Ingrédient</Text>
          <View style={styles.searchBar}>
            <Search size={18} color={Colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              value={search}
              onChangeText={handleSearch}
              placeholder="Rechercher un ingrédient"
              placeholderTextColor={Colors.textSecondary}
              autoCorrect={false}
              autoCapitalize="none"
            />
            {search.length > 0 && (
              <Pressable
                hitSlop={8}
                onPress={() => {
                  setSearch("");
                  setSelectedIngredient(null);
                  setSuggestions([]);
                }}
              >
                <X size={16} color={Colors.textSecondary} />
              </Pressable>
            )}
          </View>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <View style={styles.dropdown}>
              {suggestions.slice(0, 5).map((ing) => (
                <Pressable
                  key={ing.ingredientID}
                  style={styles.suggestion}
                  onPress={() => handleSelectSuggestion(ing)}
                >
                  <Text style={styles.suggestionText}>{ing.name}</Text>
                  <Text style={styles.suggestionUnit}>{ing.unitDefault}</Text>
                </Pressable>
              ))}
            </View>
          )}

          {/* Quantity + Unit */}
          <View style={styles.row}>
            <View style={styles.quantityField}>
              <Text style={styles.label}>Quantité</Text>
              <TextInput
                style={styles.input}
                value={quantity}
                onChangeText={setQuantity}
                placeholder="Ex. : 100"
                placeholderTextColor={Colors.textSecondary}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.unitField}>
              <Text style={styles.label}>Unité</Text>
              <Pressable
                style={styles.unitSelector}
                onPress={() => setShowUnitPicker((v) => !v)}
              >
                <Text style={unit ? styles.unitText : styles.unitPlaceholder}>
                  {unit || "Choisir"}
                </Text>
                <ChevronDown size={16} color={Colors.textSecondary} />
              </Pressable>
            </View>
          </View>

          {/* Unit picker */}
          {showUnitPicker && (
            <FlatList
              data={UNITS}
              horizontal
              keyExtractor={(u) => String(u.unitID)}
              showsHorizontalScrollIndicator={false}
              style={styles.unitPicker}
              contentContainerStyle={styles.unitPickerContent}
              keyboardShouldPersistTaps="always"
              renderItem={({ item: u }) => (
                <Pressable
                  style={[styles.unitChip, unit === u.type && styles.unitChipActive]}
                  onPress={() => handleSelectUnit(u)}
                >
                  <Text
                    style={[
                      styles.unitChipText,
                      unit === u.type && styles.unitChipTextActive,
                    ]}
                  >
                    {u.type || "–"}
                  </Text>
                </Pressable>
              )}
            />
          )}

          {/* Save */}
          <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              !canSave && styles.saveButtonDisabled,
              pressed && canSave && styles.saveButtonPressed,
            ]}
            onPress={handleSave}
            disabled={!canSave}
          >
            <Text style={styles.saveText}>
              {isEdit ? "Enregistrer" : "Ajouter"}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  sheetWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },

  sheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 36,
  },

  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: "center",
    marginBottom: 20,
  },

  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  sheetTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },

  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
    marginBottom: 6,
  },

  searchBar: {
    height: 52,
    backgroundColor: Colors.surface,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 8,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },

  dropdown: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
    overflow: "hidden",
  },

  suggestion: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  suggestionText: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },

  suggestionUnit: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },

  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
  },

  quantityField: {
    flex: 1,
  },

  unitField: {
    flex: 1,
  },

  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },

  unitSelector: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  unitText: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },

  unitPlaceholder: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },

  unitPicker: {
    marginBottom: 16,
  },

  unitPickerContent: {
    gap: 8,
    paddingVertical: 4,
  },

  unitChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },

  unitChipActive: {
    backgroundColor: Colors.primaryButton,
    borderColor: Colors.primaryButton,
  },

  unitChipText: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },

  unitChipTextActive: {
    color: Colors.surface,
    fontWeight: FontWeight.semibold,
  },

  saveButton: {
    backgroundColor: Colors.primaryButton,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },

  saveButtonDisabled: {
    opacity: 0.45,
  },

  saveButtonPressed: {
    backgroundColor: Colors.primaryDarkButton,
  },

  saveText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.surface,
  },
});
