import { View, TextInput, StyleSheet, Pressable } from "react-native";
import { Search, SlidersHorizontal } from "lucide-react-native";
import { COLORS } from "../../constants";

type SearchBarProps = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress?: () => void;
  showFilter?: boolean;
  filterButtonColor?: string;
};

export default function SearchBar({
  placeholder,
  value,
  onChangeText,
  onFilterPress,
  showFilter = false,
  filterButtonColor = COLORS.secondaryBackground,
}: SearchBarProps) {
  return (
    <View style={styles.searchRow}>
      <View style={styles.searchBar}>
        <Search size={18} color={COLORS.textSecondary} />

        <TextInput
          placeholder={placeholder}
          placeholderTextColor={COLORS.textLight}
          style={styles.searchInput}
          value={value}
          onChangeText={onChangeText}
        />
      </View>

      {showFilter && (
        <Pressable
          style={[
            styles.filterButton,
            { backgroundColor: filterButtonColor },
          ]}
          onPress={onFilterPress}
        >
          <SlidersHorizontal size={20} color={COLORS.textPrimary} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 24,
    marginBottom: 20,
  },

  searchBar: {
    flex: 1,
    height: 52,
    backgroundColor: COLORS.card,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: COLORS.textPrimary,
  },

  filterButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.secondaryBackground,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});