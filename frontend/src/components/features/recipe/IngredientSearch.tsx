import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import { X, ChevronDown } from 'lucide-react-native'
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, ComponentSize } from '@/src/constants'
import { Ingredient } from '@/src/types/ingredient'

type SelectedIngredient = {
    ingredient: Ingredient
    quantity: number
    unit: string
}

type Props = {
    onChange: (ingredients: SelectedIngredient[]) => void
}

// Données mockées en attendant le service
const MOCK_INGREDIENTS: Ingredient[] = [
    { id: 1, name: 'Farine', unit: 'g' },
    { id: 2, name: 'Sucre', unit: 'g' },
    { id: 3, name: 'Beurre', unit: 'g' },
    { id: 4, name: 'Lait', unit: 'ml' },
    { id: 5, name: 'Œuf', unit: 'unité' },
    { id: 6, name: 'Sel', unit: 'g' },
    { id: 7, name: 'Huile', unit: 'ml' },
]

export default function IngredientSearch({ onChange }: Props) {
    const [search, setSearch] = useState('')
    const [suggestions, setSuggestions] = useState<Ingredient[]>([])
    const [selected, setSelected] = useState<SelectedIngredient[]>([])

    const handleSearch = (text: string) => {
        setSearch(text)
        if (text.length < 1) {
            setSuggestions([])
            return
        }
        const filtered = MOCK_INGREDIENTS.filter(i =>
            i.name.toLowerCase().includes(text.toLowerCase()) &&
            !selected.find(s => s.ingredient.id === i.id)
        )
        setSuggestions(filtered)
    }

    const handleSelect = (ingredient: Ingredient) => {
        const newSelected = [
            ...selected,
            { ingredient, quantity: 1, unit: ingredient.unit }
        ]
        setSelected(newSelected)
        onChange(newSelected)
        setSearch('')
        setSuggestions([])
    }

    const handleRemove = (id: number) => {
        const newSelected = selected.filter(s => s.ingredient.id !== id)
        setSelected(newSelected)
        onChange(newSelected)
    }

    const handleQuantityChange = (id: number, quantity: string) => {
        const newSelected = selected.map(s =>
            s.ingredient.id === id ? { ...s, quantity: parseFloat(quantity) || 0 } : s
        )
        setSelected(newSelected)
        onChange(newSelected)
    }

    const handleUnitChange = (id: number) => {
        const units = ['g', 'ml', 'unité']
        const newSelected = selected.map(s => {
            if (s.ingredient.id !== id) return s
            const currentIndex = units.indexOf(s.unit)
            const nextUnit = units[(currentIndex + 1) % units.length]
            return { ...s, unit: nextUnit }
        })
        setSelected(newSelected)
        onChange(newSelected)
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
                            key={ingredient.id}
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
                <View key={item.ingredient.id} style={styles.selectedItem}>
                    <Text style={styles.ingredientName}>{item.ingredient.name}</Text>

                    <View style={styles.controls}>
                        <TextInput
                            style={styles.quantityInput}
                            value={String(item.quantity)}
                            keyboardType="numeric"
                            onChangeText={(text) => handleQuantityChange(item.ingredient.id, text)}
                        />

                        <TouchableOpacity
                            style={styles.unitButton}
                            onPress={() => handleUnitChange(item.ingredient.id)}
                        >
                            <Text style={styles.unitText}>{item.unit}</Text>
                            <ChevronDown size={12} color={Colors.textSecondary} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => handleRemove(item.ingredient.id)}>
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