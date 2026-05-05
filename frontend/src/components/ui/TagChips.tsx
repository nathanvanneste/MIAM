import { ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '@/src/constants'
import { Tag } from '@/src/types/recipe'

type Props = {
    tags: Tag[]
    selectedIDs: Set<number>
    onToggle: (tagID: number) => void
    horizontal?: boolean
}

export default function TagChips({ tags, selectedIDs, onToggle, horizontal = true }: Props) {
    if (tags.length === 0) return null
    return (
        <ScrollView
            horizontal={horizontal}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.container, horizontal ? styles.containerRow : styles.containerWrap]}
            keyboardShouldPersistTaps="handled"
        >
            {tags.map(tag => {
                const selected = selectedIDs.has(tag.tagID)
                return (
                    <TouchableOpacity
                        key={tag.tagID}
                        style={[styles.chip, selected && styles.chipSelected]}
                        onPress={() => onToggle(tag.tagID)}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                            {tag.name}
                        </Text>
                    </TouchableOpacity>
                )
            })}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: Spacing.xs,
        paddingVertical: Spacing.xs,
    },
    containerRow: {
        flexWrap: 'nowrap',
        paddingHorizontal: Spacing.xl,
    },
    containerWrap: {
        flexWrap: 'wrap',
    },
    chip: {
        paddingHorizontal: Spacing.md,
        paddingVertical: 6,
        borderRadius: BorderRadius.full,
        borderWidth: 1,
        borderColor: Colors.border,
        backgroundColor: Colors.surface,
    },
    chipSelected: {
        backgroundColor: Colors.primaryButton,
        borderColor: Colors.primaryLight,
    },
    chipText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.medium,
        color: Colors.textSecondary,
    },
    chipTextSelected: {
        color: Colors.primary,
        fontWeight: FontWeight.semibold,
    },
})
