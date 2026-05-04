import { useState, useEffect } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { X } from 'lucide-react-native'
import { router } from 'expo-router'
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '@/src/constants'
import { RecipeDetail } from '@/src/services/recipes.service'
import { getSignedRecipePhotoUrl } from '@/src/services/storage.service'

export const CARD_WIDTH = 148

type Props = {
    recipe: RecipeDetail
    isEditing: boolean
    onRemove: () => void
}

export default function GroupRecipeCard({ recipe, isEditing, onRemove }: Props) {
    const [photoUrl, setPhotoUrl] = useState<string | null>(null)

    useEffect(() => {
        if (!recipe.photo) return
        if (recipe.photo.startsWith('http')) { setPhotoUrl(recipe.photo); return }
        getSignedRecipePhotoUrl(recipe.photo).then(setPhotoUrl).catch(() => {})
    }, [recipe.photo])

    return (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={isEditing ? 1 : 0.75}
            onPress={() => !isEditing && router.push({
                pathname: '/recipe/[recipeID]',
                params: { recipeID: recipe.recipeID.toString() },
            })}
        >
            {photoUrl ? (
                <Image source={{ uri: photoUrl }} style={styles.photo} />
            ) : (
                <View style={[styles.photo, styles.photoFallback]}>
                    <Text style={styles.photoInitial}>{recipe.name[0]?.toUpperCase()}</Text>
                </View>
            )}
            <Text style={styles.name} numberOfLines={2}>{recipe.name}</Text>
            <Text style={styles.meta}>{(recipe.prepTime ?? 0) + (recipe.cookTime ?? 0)} min</Text>

            {isEditing && (
                <TouchableOpacity style={styles.removeOverlay} onPress={onRemove} hitSlop={8}>
                    <X size={14} color={Colors.surface} />
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.border,
        overflow: 'hidden',
    },
    photo: {
        width: '100%',
        height: CARD_WIDTH * 0.65,
        resizeMode: 'cover',
    },
    photoFallback: {
        backgroundColor: Colors.cardLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    photoInitial: {
        fontSize: FontSize.xxxxl,
        fontWeight: FontWeight.bold,
        color: Colors.primaryMuted,
    },
    name: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: Colors.textPrimary,
        paddingHorizontal: Spacing.sm,
        paddingTop: Spacing.xs,
    },
    meta: {
        fontSize: FontSize.xs,
        color: Colors.textSecondary,
        paddingHorizontal: Spacing.sm,
        paddingBottom: Spacing.sm,
        marginTop: 2,
    },
    removeOverlay: {
        position: 'absolute',
        top: Spacing.xs,
        right: Spacing.xs,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: Colors.error,
        alignItems: 'center',
        justifyContent: 'center',
    },
})
