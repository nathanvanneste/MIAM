import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import { X, ChevronDown } from 'lucide-react-native'
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, ComponentSize } from '@/src/constants'
import { Ingredient } from '@/src/types/ingredient'
import { searchIngredients } from '@/src/services/ingredients.service'
import { UNITS } from '@/src/constants/units'
import { CreateRecipeIngredientDTO } from '@/src/types/recipeIngredient'


type SelectedIngredient = {
    ingredient: Ingredient
    quantity: number
    unitID: number
    unitType: string
}

type Props = {
    onChange: (ingredients: CreateRecipeIngredientDTO[]) => void
}

export default function IngredientSearch({ onChange }: Props) {
    const [search, setSearch] = useState('')
    const [suggestions, setSuggestions] = useState<Ingredient[]>([])
    const [selected, setSelected] = useState<SelectedIngredient[]>([])

    const handleSearch = async (text: string) => {
        setSearch(text)
        if (text.length < 1) {
            setSuggestions([])
            return
        }
        try {
            const results = await searchIngredients(text)
            const filtered = results.filter(i => !selected.find(s => s.ingredient.ingredientID === i.ingredientID))
            setSuggestions(filtered)
        } catch (e) {
            setSuggestions([])
        }
    }


    const handleSelect = (ingredient: Ingredient) => {
        const defaultUnit = UNITS.find(u => u.type === ingredient.unitDefault)
        const newSelected: SelectedIngredient[] = [
            ...selected,
            {
                ingredient,
                quantity: 1,
                unitID: defaultUnit?.unitID ?? 1,
                unitType: defaultUnit?.type ?? ingredient.unitDefault,
            }
        ]
        setSelected(newSelected)
        onChange(newSelected.map(s => ({
            ingredientID: s.ingredient.ingredientID,
            quantity: s.quantity,
            unitID: s.unitID,
        })))
        setSearch('')
        setSuggestions([])
    }

    const handleRemove = (id: number) => {
        const newSelected = selected.filter(s => s.ingredient.ingredientID !== id)
        setSelected(newSelected)
        onChange(newSelected.map(s => ({
            ingredientID: s.ingredient.ingredientID,
            quantity: s.quantity,
            unitID: s.unitID,
        })))
    }

    const handleQuantityChange = (id: number, quantity: string) => {
        const newSelected = selected.map(s =>
            s.ingredient.ingredientID === id ? { ...s, quantity: parseFloat(quantity) || 0 } : s
        )
        setSelected(newSelected)
        onChange(newSelected.map(s => ({
            ingredientID: s.ingredient.ingredientID,
            quantity: s.quantity,
            unitID: s.unitID,
        })))
    }

    const handleUnitChange = (id: number) => {
        const newSelected = selected.map(s => {
            if (s.ingredient.ingredientID !== id) return s
            const currentIndex = UNITS.findIndex(u => u.unitID === s.unitID)
            const nextUnit = UNITS[(currentIndex + 1) % UNITS.length]
            return { ...s, unitID: nextUnit.unitID, unitType: nextUnit.type }
        })
        setSelected(newSelected)
        onChange(newSelected.map(s => ({
            ingredientID: s.ingredient.ingredientID,
            quantity: s.quantity,
            unitID: s.unitID,
        })))
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
            />

            {/* Suggestions */}
            {suggestions.length > 0 && (
                <View style={styles.dropdown}>
                    {suggestions.map(ingredient => (
                        <TouchableOpacity
                            key={String(ingredient.ingredientID)}
                            style={styles.suggestion}
                            onPress={() => handleSelect(ingredient)}
                        >
                            <Text style={styles.suggestionText}>{ingredient.name}</Text>
                            <Text style={styles.suggestionUnit}>{ingredient.unit}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/* Ingrédients sélectionnés */}
            {selected.map(item => (
                <View key={item.ingredient.ingredientID} style={styles.selectedItem}>
                    <Text style={styles.ingredientName}>{item.ingredient.name}</Text>

                    <View style={styles.controls}>
                        <TextInput
                            style={styles.quantityInput}
                            value={String(item.quantity)}
                            keyboardType="numeric"
                            onChangeText={(text) => handleQuantityChange(item.ingredient.ingredientID, text)}
                        />

                        <TouchableOpacity
                            style={styles.unitButton}
                            onPress={() => handleUnitChange(item.ingredient.ingredientID)}
                        >
                            <Text style={styles.unitText}>{item.unitType}</Text>
                            <ChevronDown size={12} color={Colors.textSecondary} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => handleRemove(item.ingredient.ingredientID)}>
                            <X size={18} color={Colors.error} />
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
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
    suggestionText: {
        fontSize: FontSize.md,
        color: Colors.textPrimary,
    },
    suggestionUnit: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
    },
    selectedItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.border,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        marginTop: Spacing.sm,
    },
    ingredientName: {
        flex: 1,
        fontSize: FontSize.md,
        color: Colors.textPrimary,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    quantityInput: {
        width: 50,
        height: 34,
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
        height: 34,
    },
    unitText: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
    },
})