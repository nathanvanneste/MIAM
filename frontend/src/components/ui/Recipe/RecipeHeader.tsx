// src/components/ui/Recipe/RecipeHeader.tsx
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { ArrowLeft, Share2, Clock, Flame, Pencil, X } from "lucide-react-native";
import { Colors } from "@/src/constants/colors";
import { FontSize, FontWeight } from "@/src/constants/typography";

type RecipeHeaderProps = {
  title: string;
  description?: string | null;
  photo?: string | null;
  prepTime: string;
  cookTime: string;
  onBack?: () => void;
  onShare?: () => void;
  isEditing?: boolean;
  onToggleEdit?: () => void;
  onEdit?: () => void;
};

export default function RecipeHeader({
  title,
  description,
  photo,
  prepTime,
  cookTime,
  onBack,
  onShare,
  isEditing = false,
  onToggleEdit,
  onEdit,
}: RecipeHeaderProps) {
  return (
    <View style={[styles.header, isEditing && styles.headerEditing]}>
      {/* Photo Banner */}
      {photo && (
        <Image
          source={{ uri: photo }}
          style={styles.photoBanner}
        />
      )}

      {/* Top row: back + toggle edit/share */}
      <View style={styles.headerTop}>
        <Pressable onPress={onBack} style={styles.iconButton} hitSlop={8}>
          <ArrowLeft size={22} color={Colors.textPrimary} />
        </Pressable>
        <View style={styles.topRight}>
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

      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Description */}
      {description ? (
        <Text style={styles.description} numberOfLines={2}>{description}</Text>
      ) : null}

      {/* Times row + edit pencil below times */}
      <View style={styles.timesRow}>
        <View style={styles.timeItem}>
          <Clock size={14} color={Colors.textSecondary} />
          <Text style={styles.timeText}>{prepTime}</Text>
        </View>
        <View style={styles.timeItem}>
          <Flame size={14} color={Colors.textSecondary} />
          <Text style={styles.timeText}>{cookTime}</Text>
        </View>

        {/* Crayon édition — aligné à droite sur la même ligne que les temps */}
        {isEditing && onEdit && (
          <Pressable onPress={onEdit} hitSlop={8} style={styles.editTimesButton}>
            <Pencil size={15} color={Colors.primaryLight} />
          </Pressable>
        )}
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

  photoBanner: {
    width: '100%',
    height: 240,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: Colors.cardLight,
  },

  headerEditing: {
    borderBottomWidth: 1.5,
    borderBottomColor: Colors.primaryLight,
  },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  topRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  iconButton: {
    padding: 4,
  },

  title: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    lineHeight: 34,
    marginBottom: 4,
  },

  description: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.regular,
    color: Colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },

  timesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  timeItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  timeText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },

  editTimesButton: {
    marginLeft: "auto",
    padding: 4,
  },

  editingBanner: {
    marginTop: 8,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.primaryLight,
    textAlign: "center",
  },
});
