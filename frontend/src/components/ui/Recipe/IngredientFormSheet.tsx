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
  ScrollView,
} from "react-native";
import { X, Search, ChevronDown } from "lucide-react-native";
import { Colors } from "../../../constants/colors";
import { FontSize, FontWeight } from "../../../constants/typography";
import { RecipeIngredient } from "../../../types/recipeIngredient";

// Common units — adapt to your Unit type
const UNITS = ["g", "kg", "ml", "l", "cl", "tsp", "tbsp", "unité", "pièce", "pincée", ""];

type IngredientFormSheetProps = {
  visible: boolean;
  // Pass existing ingredient to pre-fill for edit mode, undefined for add mode
  ingredient?: RecipeIngredient;
  onClose: () => void;
  onSave: (data: { name: string; quantity: number; unit: string }) => void;
};

export default function IngredientFormSheet({
  visible,
  ingredient,
  onClose,
  onSave,
}: IngredientFormSheetProps) {
  const isEdit = !!ingredient;

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [showUnitPicker, setShowUnitPicker] = useState(false);

  useEffect(() => {
    if (visible) {
      setName(ingredient?.ingredient?.name ?? "");
      setQuantity(ingredient?.quantity ? String(ingredient.quantity) : "");
      setUnit(ingredient?.unit?.type ?? "");
      setShowUnitPicker(false);
    }
  }, [visible, ingredient]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      quantity: parseFloat(quantity) || 0,
      unit,
    });
    onClose();
  };

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

          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>
              {isEdit ? "Modifier un ingrédient" : "Ajouter un ingrédient"}
            </Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <X size={22} color={Colors.textPrimary} />
            </Pressable>
          </View>

          {/* Ingredient name search */}
          <Text style={styles.label}>Ingrédient</Text>
          <View style={styles.searchRow}>
            <Search size={16} color={Colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              value={name}
              onChangeText={setName}
              placeholder="Rechercher un ingrédient"
              placeholderTextColor={Colors.textSecondary}
            />
            {name.length > 0 && (
              <Pressable onPress={() => setName("")} hitSlop={8}>
                <X size={16} color={Colors.textSecondary} />
              </Pressable>
            )}
          </View>

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
                style={styles.input}
                onPress={() => setShowUnitPicker((v) => !v)}
              >
                <Text style={unit ? styles.unitText : styles.unitPlaceholder}>
                  {unit || "Choisir"}
                </Text>
                <ChevronDown size={16} color={Colors.textSecondary} />
              </Pressable>
            </View>
          </View>

          {/* Unit picker inline */}
          {showUnitPicker && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.unitPicker}
              contentContainerStyle={styles.unitPickerContent}
            >
              {UNITS.map((u) => (
                <Pressable
                  key={u || "none"}
                  style={[styles.unitChip, unit === u && styles.unitChipActive]}
                  onPress={() => {
                    setUnit(u);
                    setShowUnitPicker(false);
                  }}
                >
                  <Text
                    style={[styles.unitChipText, unit === u && styles.unitChipTextActive]}
                  >
                    {u || "–"}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          )}

          {/* Save */}
          <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              !name.trim() && styles.saveButtonDisabled,
              pressed && name.trim() && styles.saveButtonPressed,
            ]}
            onPress={handleSave}
            disabled={!name.trim()}
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
    marginBottom: 24,
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

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
  },

  searchInput: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },

  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
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
