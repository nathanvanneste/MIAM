import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { Plus, ChevronDown } from 'lucide-react-native'
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, ComponentSize } from '@/src/constants'
import { ShoppingItem } from '@/src/types/shoppingList'
import { Ingredient } from '@/src/types/ingredient'
import { searchIngredients } from '@/src/services/ingredients.service'
import { UNITS } from '@/src/constants/units'

type Props = {
    listID: number
    onAdd: (item: Omit<ShoppingItem, 'itemID'>) => void
}

export default function AddShoppingItem({ listID, onAdd }: Props) {
    const [name, setName] = useState('')
    const [quantity, setQuantity] = useState('')
    const [unitIndex, setUnitIndex] = useState(0)
    const [selectedIngredientID, setSelectedIngredientID] = useState<number | undefined>()
    const [suggestions, setSuggestions] = useState<Ingredient[]>([])
    const [showUnitPicker, setShowUnitPicker] = useState(false)

    const currentUnit = UNITS[unitIndex]

    const handleSearch = async (text: string) => {
        setName(text)
        setSelectedIngredientID(undefined)
        if (text.length < 1) { setSuggestions([]); return }
        try {
            const results = await searchIngredients(text)
            setSuggestions(results.slice(0, 5))
        } catch {
            setSuggestions([])
        }
    }

    // Remplit le champ sans ajouter — l'utilisateur règle la quantité/unité puis tape +
    const handleSelectIngredient = (ingredient: Ingredient) => {
        const idx = UNITS.findIndex(u => u.type === ingredient.unitDefault)
        if (idx >= 0) setUnitIndex(idx)
        setSelectedIngredientID(ingredient.ingredientID)
        setName(ingredient.name)
        setSuggestions([])
        setShowUnitPicker(false)
    }

    const handleAdd = () => {
        if (!name.trim()) return
        onAdd({
            name: name.trim(),
            quantity: quantity ? parseFloat(quantity) : undefined,
            checked: false,
            listID,
            ingredientID: selectedIngredientID,
            unitID: quantity ? currentUnit.unitID : undefined,
        })
        setName('')
        setQuantity('')
        setSelectedIngredientID(undefined)
        setSuggestions([])
        setShowUnitPicker(false)
    }

    return (
        <View>
            {/* Sélecteur d'unité */}
            {showUnitPicker && (
                <View style={styles.unitPickerRow}>
                    {UNITS.map((unit, idx) => (
                        <TouchableOpacity
                            key={unit.unitID}
                            style={[styles.unitOption, unitIndex === idx && styles.unitOptionActive]}
                            onPress={() => { setUnitIndex(idx); setShowUnitPicker(false) }}
                        >
                            <Text style={[styles.unitOptionText, unitIndex === idx && styles.unitOptionTextActive]}>
                                {unit.type}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && (
                <View style={styles.dropdown}>
                    {suggestions.map(ingredient => (
                        <TouchableOpacity
                            key={String(ingredient.ingredientID)}
                            style={styles.suggestion}
                            onPress={() => handleSelectIngredient(ingredient)}
                        >
                            <Text style={styles.suggestionText}>{ingredient.name}</Text>
                            <Text style={styles.suggestionUnit}>{ingredient.unitDefault}</Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity style={styles.suggestion} onPress={handleAdd}>
                        <Text style={styles.addFreeText}>Ajouter "{name}" manuellement</Text>
                    </TouchableOpacity>
                </View>
            )}

            <View style={styles.row}>
                <TextInput
                    style={styles.input}
                    placeholder="Article..."
                    placeholderTextColor={Colors.textSecondary}
                    value={name}
                    onChangeText={handleSearch}
                    onSubmitEditing={handleAdd}
                    returnKeyType="done"
                    multiline={false}
                    numberOfLines={1}
                />
                <TextInput
                    style={styles.qtyInput}
                    placeholder="Qté"
                    placeholderTextColor={Colors.textSecondary}
                    value={quantity}
                    onChangeText={setQuantity}
                    keyboardType="numeric"
                    multiline={false}
                />
                <TouchableOpacity
                    style={[styles.unitButton, showUnitPicker && styles.unitButtonActive]}
                    onPress={() => setShowUnitPicker(v => !v)}
                >
                    <Text style={styles.unitText}>{currentUnit.type}</Text>
                    <ChevronDown size={10} color={Colors.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
                    <Plus size={20} color={Colors.surface} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    unitPickerRow: {
        flexDirection: 'row',
        gap: Spacing.sm,
        marginBottom: Spacing.sm,
        justifyContent: 'flex-end',
    },
    unitOption: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.full,
        borderWidth: 1,
        borderColor: Colors.border,
        backgroundColor: Colors.surface,
    },
    unitOptionActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    unitOptionText: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        fontWeight: FontWeight.medium,
    },
    unitOptionTextActive: {
        color: Colors.surface,
    },
    dropdown: {
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.border,
        marginBottom: Spacing.sm,
        overflow: 'hidden',
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
    addFreeText: { fontSize: FontSize.sm, color: Colors.primaryLight, fontWeight: FontWeight.medium },
    row: { flexDirection: 'row', gap: Spacing.sm },
    input: {
        flex: 1,
        height: ComponentSize.inputHeight,
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.border,
        paddingHorizontal: Spacing.md,
        fontSize: FontSize.md,
        color: Colors.textPrimary,
    },
    qtyInput: {
        width: 52,
        height: ComponentSize.inputHeight,
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.border,
        paddingHorizontal: Spacing.xs,
        fontSize: FontSize.md,
        color: Colors.textPrimary,
        textAlign: 'center',
    },
    unitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        height: ComponentSize.inputHeight,
        paddingHorizontal: Spacing.sm,
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.border,
        minWidth: 46,
        justifyContent: 'center',
    },
    unitButtonActive: {
        borderColor: Colors.primary,
    },
    unitText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: FontWeight.medium },
    addButton: {
        width: ComponentSize.inputHeight,
        height: ComponentSize.inputHeight,
        backgroundColor: Colors.primary,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
})
