import { useState, useEffect } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { Colors } from '../../../constants/colors'
import { FontSize, FontWeight } from '../../../constants/typography'
import type { Recipe } from '../../../types/recipe'
import { getSignedRecipePhotoUrl } from '../../../services/storage.service'
import UserAvatar from '../UserAvatar'
import { groupColor } from '../../../utils/groupColor'

type RecipeCardProps = {
    recipe: Recipe
    cardWidth: number
    creator?: { pseudo: string; avatar?: string | null }
}

export default function RecipeCard({ recipe, cardWidth, creator }: RecipeCardProps) {
    const [photoUrl, setPhotoUrl] = useState<string | null>(null)
    const fallbackColor = groupColor(recipe.name)
    const photoHeight = Math.round(cardWidth * 0.72)
    const totalTime = (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0)

    useEffect(() => {
        if (!recipe.photo) return
        if (recipe.photo.startsWith('http')) { setPhotoUrl(recipe.photo); return }
        getSignedRecipePhotoUrl(recipe.photo).then(setPhotoUrl).catch(() => {})
    }, [recipe.photo])

    return (
        <TouchableOpacity
            style={[styles.card, { width: cardWidth }]}
            activeOpacity={0.8}
            onPress={() => router.push({
                pathname: '/recipe/[recipeID]',
                params: { recipeID: recipe.recipeID.toString() },
            })}
        >
            {photoUrl ? (
                <Image source={{ uri: photoUrl }} style={[styles.photo, { height: photoHeight }]} />
            ) : (
                <View style={[styles.photo, styles.photoFallback, { height: photoHeight, backgroundColor: fallbackColor }]}>
                    <Text style={[styles.photoInitial, { fontSize: cardWidth * 0.32 }]}>
                        {recipe.name[0]?.toUpperCase()}
                    </Text>
                </View>
            )}

            <View style={styles.body}>
                {creator && (
                    <View style={styles.creatorRow}>
                        <UserAvatar user={creator} size={18} />
                        <Text style={styles.creatorPseudo} numberOfLines={1}>@{creator.pseudo}</Text>
                    </View>
                )}
                <Text style={styles.name} numberOfLines={2}>{recipe.name}</Text>
                <Text style={styles.meta} numberOfLines={1}>
                    {totalTime > 0 ? `${totalTime} min` : ''}
                    {totalTime > 0 && recipe.ingredients.length > 0 ? ' · ' : ''}
                    {recipe.ingredients.length > 0 ? `${recipe.ingredients.length} ingr.` : ''}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.border,
        overflow: 'hidden',
        marginBottom: 12,
    },
    photo: {
        width: '100%',
        resizeMode: 'cover',
    },
    photoFallback: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    photoInitial: {
        fontWeight: FontWeight.bold,
        color: Colors.primary,
        opacity: 0.45,
    },
    body: {
        padding: 10,
        gap: 2,
    },
    creatorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 2,
    },
    creatorPseudo: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.medium,
        color: Colors.primaryLight,
        flex: 1,
    },
    name: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: Colors.textPrimary,
        lineHeight: 18,
    },
    meta: {
        fontSize: FontSize.xs,
        color: Colors.textSecondary,
        marginTop: 1,
    },
})
