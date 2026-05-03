import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { Plus } from 'lucide-react-native'
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, ComponentSize } from '@/src/constants'
import { ShoppingItem } from '@/src/types/shoppingList'
import { Ingredient } from '@/src/types/ingredient'
import { searchIngredients } from '@/src/services/ingredients.service'

type Props = {
    listID: number
    onAdd: (item: Omit<ShoppingItem, 'itemID'>) => void
}

export default function AddShoppingItem({ listID, onAdd }: Props) {
    const [name, setName] = useState('')
    const [quantity, setQuantity] = useState('')
    const [suggestions, setSuggestions] = useState<Ingredient[]>([])

    const handleSearch = async (text: string) => {
        setName(text)
        if (text.length < 1) {
            setSuggestions([])
            return
        }
        try {
            const results = await searchIngredients(text)
            setSuggestions(results.slice(0, 5))
        } catch {
            setSuggestions([])
        }
    }

    const handleSelectIngredient = (ingredient: Ingredient) => {
        onAdd({
            name: ingredient.name,
            quantity: quantity ? parseFloat(quantity) : undefined,
            checked: false,
            listID,
            ingredientID: ingredient.ingredientID,
        })
        setName('')
        setQuantity('')
        setSuggestions([])
    }

    const handleAddFree = () => {
        if (!name.trim()) return
        onAdd({
            name: name.trim(),
            quantity: quantity ? parseFloat(quantity) : undefined,
            checked: false,
            listID,
        })
        setName('')
        setQuantity('')
        setSuggestions([])
    }

    return (
        <View>
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
                    {/* Toujours proposer l'ajout libre */}
                    <TouchableOpacity style={styles.suggestion} onPress={handleAddFree}>
                        <Text style={styles.addFreeText}>Ajouter "{name}" manuellement</Text>
                    </TouchableOpacity>
                </View>
            )}

            <View style={styles.row}>
                <TextInput
                    style={styles.input}
                    placeholder="Ajouter un article..."
                    placeholderTextColor={Colors.textSecondary}
                    value={name}
                    onChangeText={handleSearch}
                    onSubmitEditing={handleAddFree}
                    returnKeyType="done"
                />
                <TextInput
                    style={styles.qtyInput}
                    placeholder="Qté"
                    placeholderTextColor={Colors.textSecondary}
                    value={quantity}
                    onChangeText={setQuantity}
                    keyboardType="numeric"
                />
                <TouchableOpacity style={styles.addButton} onPress={handleAddFree}>
                    <Plus size={20} color={Colors.surface} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
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
    suggestionText: {
        fontSize: FontSize.md,
        color: Colors.textPrimary,
    },
    suggestionUnit: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
    },
    addFreeText: {
        fontSize: FontSize.sm,
        color: Colors.primaryLight,
        fontWeight: FontWeight.medium,
    },
    row: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
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
        width: 60,
        height: ComponentSize.inputHeight,
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.border,
        paddingHorizontal: Spacing.sm,
        fontSize: FontSize.md,
        color: Colors.textPrimary,
        textAlign: 'center',
    },
    addButton: {
        width: ComponentSize.inputHeight,
        height: ComponentSize.inputHeight,
        backgroundColor: Colors.primary,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
})