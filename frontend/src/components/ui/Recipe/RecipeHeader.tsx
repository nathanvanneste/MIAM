// src/components/ui/Recipe/RecipeHeader.tsx
import { View, Text, StyleSheet, Pressable } from "react-native";
import { ArrowLeft, Share2, Clock, Timer, Pencil, X } from "lucide-react-native";
import { Colors } from "../../../constants/colors";
import { FontSize, FontWeight } from "../../../constants/typography";

type RecipeHeaderProps = {
  title: string;
  description?: string | null;
  prepTime: string;
  totalTime: string;
  onBack?: () => void;
  onShare?: () => void;
  // Edit mode
  isEditing?: boolean;
  onToggleEdit?: () => void;  // bascule édition on/off
  onEdit?: () => void;        // ouvre le sheet header (uniquement si isEditing)
};

export default function RecipeHeader({
  title,
  description,
  prepTime,
  totalTime,
  onBack,
  onShare,
  isEditing = false,
  onToggleEdit,
  onEdit,
}: RecipeHeaderProps) {
  return (
    <View style={[styles.header, isEditing && styles.headerEditing]}>
      <View style={styles.headerTop}>
        <Pressable onPress={onBack} style={styles.iconButton} hitSlop={8}>
          <ArrowLeft size={22} color={Colors.textPrimary} />
        </Pressable>

        <View style={styles.topRight}>
          {/* Bouton bascule édition — crayon pour activer, X pour quitter */}
          {onToggleEdit && (
            <Pressable onPress={onToggleEdit} style={styles.iconButton} hitSlop={8}>
              {isEditing
                ? <X size={22} color={Colors.primaryLight} />
                : <Pencil size={20} color={Colors.textPrimary} />
              }
            </Pressable>
          )}
          {!isEditing && onShare && (
            <Pressable onPress={onShare} style={styles.iconButton} hitSlop={8}>
              <Share2 size={22} color={Colors.textPrimary} />
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.headerMeta}>
        <View style={styles.headerLeft}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{title}</Text>
            {/* Crayon du titre — uniquement visible en mode édition */}
            {isEditing && onEdit && (
              <Pressable onPress={onEdit} hitSlop={8} style={styles.titleEditButton}>
                <Pencil size={16} color={Colors.primaryLight} />
              </Pressable>
            )}
          </View>

          {description ? (
            <Text style={styles.description} numberOfLines={2}>
              {description}
            </Text>
          ) : null}
        </View>

        <View style={styles.headerRight}>
          <View style={styles.timeRow}>
            <Clock size={14} color={Colors.textSecondary} />
            <Text style={styles.timeText}>{prepTime}</Text>
          </View>
          <View style={styles.timeRow}>
            <Timer size={14} color={Colors.textSecondary} />
            <Text style={styles.timeText}>{totalTime}</Text>
          </View>
        </View>
      </View>

      {isEditing && (
        <Text style={styles.editingBanner}>Mode édition activé</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: Colors.background,
  },

  headerEditing: {
    borderBottomWidth: 1.5,
    borderBottomColor: Colors.primaryLight,
  },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },

  topRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  iconButton: {
    padding: 4,
  },

  headerMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  headerLeft: {
    flex: 1,
    marginRight: 12,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },

  title: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    lineHeight: 34,
  },

  titleEditButton: {
    padding: 2,
    marginTop: 4,
  },

  description: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.regular,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 20,
  },

  headerRight: {
    alignItems: "flex-end",
    gap: 4,
  },

  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  timeText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },

  editingBanner: {
    marginTop: 8,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.primaryLight,
    textAlign: "center",
  },
});
