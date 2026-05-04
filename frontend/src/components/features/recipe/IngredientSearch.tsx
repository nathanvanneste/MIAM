import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { X, ChevronDown, Plus } from 'lucide-react-native'
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, ComponentSize } from '@/src/constants'
import { Ingredient } from '@/src/types/ingredient'
import { searchIngredients } from '@/src/services/ingredients.service'
import { normalize } from '@/src/utils/search'
import { UNITS } from '@/src/constants/units'
import { CreateRecipeIngredientDTO } from '@/src/types/recipeIngredient'

type SelectedIngredient = {
    ingredient: Ingredient
    quantity: number
    unitID: number
    unitType: string
}

type StagedIngredient = {
    ingredient: Ingredient
    quantity: string
    unitIndex: number
}

type Props = {
    onChange: (ingredients: CreateRecipeIngredientDTO[]) => void
}

export default function IngredientSearch({ onChange }: Props) {
    const [search, setSearch] = useState('')
    const [suggestions, setSuggestions] = useState<Ingredient[]>([])
    const [staged, setStaged] = useState<StagedIngredient | null>(null)
    const [showStagedUnitPicker, setShowStagedUnitPicker] = useState(false)
    const [selected, setSelected] = useState<SelectedIngredient[]>([])
    const [openUnitPicker, setOpenUnitPicker] = useState<number | null>(null)

    const notify = (items: SelectedIngredient[]) => {
        onChange(items.map(s => ({
            ingredientID: s.ingredient.ingredientID,
            quantity: s.quantity,
            unitID: s.unitID,
        })))
    }

    const handleSearch = async (text: string) => {
        setSearch(text)
        if (text.length < 1) { setSuggestions([]); return }
        try {
            const results = await searchIngredients(text)
            const q = normalize(text)
            const filtered = results.filter(i => !selected.find(s => s.ingredient.ingredientID === i.ingredientID))
            filtered.sort((a, b) => {
                const aStarts = normalize(a.name).startsWith(q)
                const bStarts = normalize(b.name).startsWith(q)
                return aStarts === bStarts ? 0 : aStarts ? -1 : 1
            })
            setSuggestions(filtered)
        } catch {
            setSuggestions([])
        }
    }

    // Tap suggestion → staging (pas encore ajouté)
    const handleSelectSuggestion = (ingredient: Ingredient) => {
        const defaultIdx = UNITS.findIndex(u => u.type === ingredient.unitDefault)
        setStaged({
            ingredient,
            quantity: '1',
            unitIndex: defaultIdx >= 0 ? defaultIdx : 0,
        })
        setSearch('')
        setSuggestions([])
        setShowStagedUnitPicker(false)
    }

    // Confirme l'ajout depuis le staging
    const handleConfirmStaged = () => {
        if (!staged) return
        const unit = UNITS[staged.unitIndex]
        const newSelected: SelectedIngredient[] = [
            ...selected,
            {
                ingredient: staged.ingredient,
                quantity: parseFloat(staged.quantity) || 1,
                unitID: unit.unitID,
                unitType: unit.type,
            },
        ]
        setSelected(newSelected)
        notify(newSelected)
        setStaged(null)
        setShowStagedUnitPicker(false)
    }

    const handleRemove = (id: number) => {
        const newSelected = selected.filter(s => s.ingredient.ingredientID !== id)
        setSelected(newSelected)
        notify(newSelected)
        if (openUnitPicker === id) setOpenUnitPicker(null)
    }

    const handleQuantityChange = (id: number, text: string) => {
        const newSelected = selected.map(s =>
            s.ingredient.ingredientID === id ? { ...s, quantity: parseFloat(text) || 0 } : s
        )
        setSelected(newSelected)
        notify(newSelected)
    }

    const handleUnitSelect = (id: number, unit: typeof UNITS[0]) => {
        const newSelected = selected.map(s =>
            s.ingredient.ingredientID === id ? { ...s, unitID: unit.unitID, unitType: unit.type } : s
        )
        setSelected(newSelected)
        notify(newSelected)
        setOpenUnitPicker(null)
    }

    return (
        <View>
            {/* Barre de recherche */}
            <TextInput
                style={styles.input}
                placeholder="Ajouter un ingrédient..."
                placeholderTextColor={Colors.textSecondary}
                value={search}
                onChangeText={handleSearch}
                multiline={false}
            />

            {/* Suggestions */}
            {suggestions.length > 0 && (
                <ScrollView
                    style={styles.dropdown}
                    keyboardShouldPersistTaps="always"
                    nestedScrollEnabled
                >
                    {suggestions.map(ingredient => (
                        <TouchableOpacity
                            key={String(ingredient.ingredientID)}
                            style={styles.suggestion}
                            onPress={() => handleSelectSuggestion(ingredient)}
                        >
                            <Text style={styles.suggestionText}>{ingredient.name}</Text>
                            <Text style={styles.suggestionUnit}>{ingredient.unitDefault}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}

            {/* Staging — configurer qty/unité avant d'ajouter */}
            {staged && (
                <View style={styles.stagingCard}>
                    {showStagedUnitPicker && (
                        <View style={styles.unitChipsRow}>
                            {UNITS.map((unit, idx) => (
                                <TouchableOpacity
                                    key={unit.unitID}
                                    style={[styles.unitChip, staged.unitIndex === idx && styles.unitChipActive]}
                                    onPress={() => {
                                        setStaged(s => s ? { ...s, unitIndex: idx } : s)
                                        setShowStagedUnitPicker(false)
                                    }}
                                >
                                    <Text style={[styles.unitChipText, staged.unitIndex === idx && styles.unitChipTextActive]}>
                                        {unit.type}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                    <View style={styles.stagingRow}>
                        <Text style={styles.stagingName} numberOfLines={1}>{staged.ingredient.name}</Text>
                        <TextInput
                            style={styles.qtyInput}
                            value={staged.quantity}
                            keyboardType="numeric"
                            onChangeText={(text) => setStaged(s => s ? { ...s, quantity: text } : s)}
                            onBlur={() => setStaged(s => {
                                if (!s) return s
                                const v = Math.min(9999, Math.max(0, parseFloat(s.quantity) || 0))
                                return { ...s, quantity: String(v) }
                            })}
                            selectTextOnFocus
                            maxLength={7}
                            multiline={false}
                        />
                        <TouchableOpacity
                            style={[styles.unitButton, showStagedUnitPicker && styles.unitButtonActive]}
                            onPress={() => setShowStagedUnitPicker(v => !v)}
                        >
                            <Text style={styles.unitText}>{UNITS[staged.unitIndex].type}</Text>
                            <ChevronDown size={10} color={Colors.textSecondary} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.addButton} onPress={handleConfirmStaged}>
                            <Plus size={18} color={Colors.surface} />
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Ingrédients confirmés */}
            {selected.map(item => {
                const id = item.ingredient.ingredientID
                const isPickerOpen = openUnitPicker === id
                return (
                    <View key={id} style={styles.selectedItem}>
                        <View style={styles.itemRow}>
                            <Text style={styles.ingredientName} numberOfLines={1}>{item.ingredient.name}</Text>
                            <View style={styles.controls}>
                                <TextInput
                                    style={styles.quantityInput}
                                    value={String(item.quantity)}
                                    keyboardType="numeric"
                                    onChangeText={(text) => handleQuantityChange(id, text)}
                                    onBlur={() => handleQuantityChange(id, String(Math.min(9999, Math.max(0, item.quantity))))}
                                    selectTextOnFocus
                                    maxLength={7}
                                    multiline={false}
                                />
                                <TouchableOpacity
                                    style={[styles.unitButton, isPickerOpen && styles.unitButtonActive]}
                                    onPress={() => setOpenUnitPicker(isPickerOpen ? null : id)}
                                >
                                    <Text style={styles.unitText}>{item.unitType}</Text>
                                    <ChevronDown size={11} color={Colors.textSecondary} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => handleRemove(id)}
                                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                >
                                    <X size={18} color={Colors.error} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Dropdown unités sur les ingrédients déjà ajoutés */}
                        {isPickerOpen && (
                            <View style={styles.unitDropdown}>
                                {UNITS.map(unit => (
                                    <TouchableOpacity
                                        key={unit.unitID}
                                        style={[styles.unitOption, item.unitID === unit.unitID && styles.unitOptionActive]}
                                        onPress={() => handleUnitSelect(id, unit)}
                                    >
                                        <Text style={[styles.unitOptionText, item.unitID === unit.unitID && styles.unitOptionTextActive]}>
                                            {unit.type}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                )
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        height: ComponentSize.inputHeight,
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.border,
        paddingHorizontal: Spacing.md,
        fontSize: FontSize.md,
        color: Colors.textPrimary,
    },
    dropdown: {
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.border,
        marginTop: Spacing.xs,
        overflow: 'hidden',
        maxHeight: 240,
    },
    suggestion: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    suggestionText: { fontSize: FontSize.md, color: Colors.textPrimary },
    suggestionUnit: { fontSize: FontSize.sm, color: Colors.textSecondary },

    // Staging
    stagingCard: {
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.primaryLight,
        marginTop: Spacing.sm,
        overflow: 'hidden',
    },
    unitChipsRow: {
        flexDirection: 'row',
        gap: Spacing.sm,
        padding: Spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        backgroundColor: Colors.background,
    },
    unitChip: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.full,
        borderWidth: 1,
        borderColor: Colors.border,
        backgroundColor: Colors.surface,
    },
    unitChipActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    unitChipText: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        fontWeight: FontWeight.medium,
    },
    unitChipTextActive: { color: Colors.surface },
    stagingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        padding: Spacing.sm,
    },
    stagingName: {
        flex: 1,
        fontSize: FontSize.md,
        fontWeight: FontWeight.medium,
        color: Colors.textPrimary,
    },
    qtyInput: {
        width: 52,
        height: ComponentSize.inputHeight,
        backgroundColor: Colors.background,
        borderRadius: BorderRadius.sm,
        borderWidth: 1,
        borderColor: Colors.border,
        textAlign: 'center',
        fontSize: FontSize.md,
        color: Colors.textPrimary,
    },
    addButton: {
        width: ComponentSize.inputHeight,
        height: ComponentSize.inputHeight,
        backgroundColor: Colors.primary,
        borderRadius: BorderRadius.sm,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Ingrédients ajoutés
    selectedItem: {
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.border,
        marginTop: Spacing.sm,
        overflow: 'hidden',
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
    },
    ingredientName: {
        flex: 1,
        fontSize: FontSize.md,
        color: Colors.textPrimary,
        marginRight: Spacing.sm,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    quantityInput: {
        width: 52,
        height: 36,
        backgroundColor: Colors.background,
        borderRadius: BorderRadius.sm,
        borderWidth: 1,
        borderColor: Colors.border,
        textAlign: 'center',
        fontSize: FontSize.md,
        color: Colors.textPrimary,
    },
    unitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        backgroundColor: Colors.background,
        borderRadius: BorderRadius.sm,
        borderWidth: 1,
        borderColor: Colors.border,
        paddingHorizontal: Spacing.sm,
        height: 36,
        minWidth: 52,
        justifyContent: 'center',
    },
    unitButtonActive: { borderColor: Colors.primary },
    unitText: { fontSize: FontSize.sm, color: Colors.textSecondary },
    unitDropdown: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        backgroundColor: Colors.background,
    },
    unitOption: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: Spacing.sm,
        borderRightWidth: 1,
        borderRightColor: Colors.border,
    },
    unitOptionActive: { backgroundColor: Colors.primary },
    unitOptionText: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        fontWeight: FontWeight.medium,
    },
    unitOptionTextActive: { color: Colors.surface },
})
