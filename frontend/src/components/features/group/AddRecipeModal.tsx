import { useState, useEffect } from 'react'
import { View, Text, Modal, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { X, Plus } from 'lucide-react-native'
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '@/src/constants'
import { RecipeDetail, getMyRecipes } from '@/src/services/recipes.service'
import { addRecipeToGroup } from '@/src/services/groups.service'

type Props = {
    visible: boolean
    groupID: number
    existingRecipeIDs: Set<number>
    onClose: () => void
    onAdded: () => void
}

export default function AddRecipeModal({ visible, groupID, existingRecipeIDs, onClose, onAdded }: Props) {
    const [recipes, setRecipes] = useState<RecipeDetail[]>([])
    const [loading, setLoading] = useState(false)
    const [adding, setAdding] = useState<number | null>(null)

    useEffect(() => {
        if (!visible) return
        setLoading(true)
        getMyRecipes().then(setRecipes).catch(() => {}).finally(() => setLoading(false))
    }, [visible])

    const handleAdd = async (recipeID: number) => {
        setAdding(recipeID)
        try {
            await addRecipeToGroup(groupID, recipeID)
            onAdded()
        } catch {
            Alert.alert('Erreur', "Impossible d'ajouter cette recette.")
        } finally {
            setAdding(null)
        }
    }

    const available = recipes.filter(r => !existingRecipeIDs.has(r.recipeID))

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        <X size={22} color={Colors.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Mes recettes</Text>
                    <View style={{ width: 22 }} />
                </View>

                {loading ? (
                    <ActivityIndicator style={{ flex: 1 }} color={Colors.primaryLight} />
                ) : (
                    <FlatList
                        data={available}
                        keyExtractor={r => String(r.recipeID)}
                        contentContainerStyle={styles.list}
                        ListEmptyComponent={
                            <View style={styles.empty}>
                                <Text style={styles.emptyText}>Toutes tes recettes sont déjà dans le groupe</Text>
                            </View>
                        }
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.row}
                                onPress={() => handleAdd(item.recipeID)}
                                disabled={adding === item.recipeID}
                            >
                                <View style={styles.rowInfo}>
                                    <Text style={styles.rowName} numberOfLines={1}>{item.name}</Text>
                                    <Text style={styles.rowMeta}>
                                        {item.ingredients.length} ingrédient{item.ingredients.length > 1 ? 's' : ''} · {(item.prepTime ?? 0) + (item.cookTime ?? 0)} min
                                    </Text>
                                </View>
                                {adding === item.recipeID
                                    ? <ActivityIndicator size="small" color={Colors.primaryLight} />
                                    : <Plus size={20} color={Colors.primary} />
                                }
                            </TouchableOpacity>
                        )}
                    />
                )}
            </SafeAreaView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    title: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
    list: { padding: Spacing.xl, gap: Spacing.sm },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.border,
        padding: Spacing.md,
    },
    rowInfo: { flex: 1 },
    rowName: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
    rowMeta: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
    empty: { alignItems: 'center', paddingVertical: 40 },
    emptyText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textPrimary, textAlign: 'center' },
})
