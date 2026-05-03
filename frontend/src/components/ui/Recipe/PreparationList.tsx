// src/components/ui/Recipe/PreparationList.tsx
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { Pencil, Check, Plus, Trash2 } from "lucide-react-native";
import { Colors } from "../../../constants/colors";
import { FontSize, FontWeight } from "../../../constants/typography";

type PreparationListProps = {
  steps: string[];
  onSave?: (steps: string[]) => void;
};

export default function PreparationList({ steps, onSave }: PreparationListProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localSteps, setLocalSteps] = useState<string[]>(steps);

  const handleEdit = (index: number, text: string) => {
    setLocalSteps((prev) => prev.map((s, i) => (i === index ? text : s)));
  };

  const handleAdd = () => {
    setLocalSteps((prev) => [...prev, ""]);
  };

  const handleDelete = (index: number) => {
    setLocalSteps((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const cleaned = localSteps.filter((s) => s.trim().length > 0);
    setLocalSteps(cleaned);
    onSave?.(cleaned);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setLocalSteps(steps);
    setIsEditing(false);
  };

  return (
    <View>
      <View style={styles.list}>
        {(isEditing ? localSteps : steps).map((step, index) => (
          <View key={index} style={styles.row}>
            <View style={[styles.stepNumber, isEditing && styles.stepNumberEditing]}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>

            {isEditing ? (
              <View style={styles.editRow}>
                <TextInput
                  style={styles.stepInput}
                  value={step}
                  onChangeText={(text) => handleEdit(index, text)}
                  multiline
                  placeholder="Décrivez cette étape..."
                  placeholderTextColor={Colors.textSecondary}
                  autoFocus={index === localSteps.length - 1 && step === ""}
                />
                <Pressable
                  onPress={() => handleDelete(index)}
                  hitSlop={8}
                  style={styles.deleteButton}
                >
                  <Trash2 size={16} color={Colors.error} />
                </Pressable>
              </View>
            ) : (
              <Text style={styles.stepText}>{step}</Text>
            )}
          </View>
        ))}
      </View>

      {/* Add step button — only in edit mode */}
      {isEditing && (
        <Pressable
          style={({ pressed }) => [styles.addButton, pressed && styles.addButtonPressed]}
          onPress={handleAdd}
        >
          <Plus size={16} color={Colors.primaryButton} strokeWidth={2.5} />
          <Text style={styles.addButtonText}>Ajouter une étape</Text>
        </Pressable>
      )}

      {/* Action buttons */}
      {onSave && (
        <View style={styles.bottomRow}>
          {isEditing ? (
            <>
              <Pressable style={styles.cancelButton} onPress={handleCancelEdit}>
                <Text style={styles.cancelText}>Annuler</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.saveButton,
                  pressed && styles.saveButtonPressed,
                ]}
                onPress={handleSave}
              >
                <Check size={16} color={Colors.surface} strokeWidth={2.5} />
                <Text style={styles.saveText}>Enregistrer</Text>
              </Pressable>
            </>
          ) : (
            <Pressable
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
              hitSlop={8}
            >
              <Pencil size={18} color={Colors.primaryLight} />
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 16,
    marginBottom: 16,
  },

  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },

  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 2,
  },

  stepNumberEditing: {
    backgroundColor: Colors.primaryMuted,
  },

  stepNumberText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.surface,
  },

  stepText: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    lineHeight: 22,
  },

  editRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },

  stepInput: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    lineHeight: 22,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 44,
  },

  deleteButton: {
    padding: 4,
    marginTop: 10,
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
    marginBottom: 16,
  },

  addButtonPressed: {
    backgroundColor: Colors.cardLight,
  },

  addButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.primaryButton,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
  },

  editButton: {
    padding: 4,
  },

  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  cancelText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },

  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.primaryButton,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },

  saveButtonPressed: {
    backgroundColor: Colors.primaryDarkButton,
  },

  saveText: {
    fontSize: FontSize.md,
    color: Colors.surface,
    fontWeight: FontWeight.bold,
  },
});
