// src/components/ui/Recipe/EditHeaderSheet.tsx
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
} from "react-native";
import { X } from "lucide-react-native";
import { Colors } from "../../../constants/colors";
import { FontSize, FontWeight } from "../../../constants/typography";

type EditHeaderSheetProps = {
  visible: boolean;
  title: string;
  prepTime: number;
  cookTime: number;
  onClose: () => void;
  onSave: (data: { title: string; prepTime: number; cookTime: number }) => void;
};

export default function EditHeaderSheet({
  visible,
  title,
  prepTime,
  cookTime,
  onClose,
  onSave,
}: EditHeaderSheetProps) {
  const [localTitle, setLocalTitle] = useState(title);
  const [localPrep, setLocalPrep] = useState(String(prepTime));
  const [localCook, setLocalCook] = useState(String(cookTime));

  useEffect(() => {
    if (visible) {
      setLocalTitle(title);
      setLocalPrep(String(prepTime));
      setLocalCook(String(cookTime));
    }
  }, [visible]);

  const handleSave = () => {
    const prep = parseInt(localPrep) || 0;
    const cook = parseInt(localCook) || 0;
    onSave({ title: localTitle.trim(), prepTime: prep, cookTime: cook });
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
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Modifier la recette</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <X size={22} color={Colors.textPrimary} />
            </Pressable>
          </View>

          {/* Titre */}
          <Text style={styles.label}>Titre</Text>
          <TextInput
            style={styles.input}
            value={localTitle}
            onChangeText={setLocalTitle}
            placeholder="Nom de la recette"
            placeholderTextColor={Colors.textSecondary}
          />

          {/* Temps */}
          <View style={styles.timeRow}>
            <View style={styles.timeField}>
              <Text style={styles.label}>Préparation (min)</Text>
              <TextInput
                style={styles.input}
                value={localPrep}
                onChangeText={setLocalPrep}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>
            <View style={styles.timeField}>
              <Text style={styles.label}>Cuisson (min)</Text>
              <TextInput
                style={styles.input}
                value={localCook}
                onChangeText={setLocalCook}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>
          </View>

          {/* Save */}
          <Pressable
            style={({ pressed }) => [styles.saveButton, pressed && styles.saveButtonPressed]}
            onPress={handleSave}
          >
            <Text style={styles.saveText}>Enregistrer</Text>
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

  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    marginBottom: 16,
  },

  timeRow: {
    flexDirection: "row",
    gap: 12,
  },

  timeField: {
    flex: 1,
  },

  saveButton: {
    backgroundColor: Colors.primaryButton,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
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
