import { useState, useEffect, useCallback } from 'react'
import {
    View, Text, FlatList, Image, TouchableOpacity,
    StyleSheet, ActivityIndicator, RefreshControl,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Users } from 'lucide-react-native'
import { router } from 'expo-router'
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '@/src/constants'
import { FeedRecipe, getFeed } from '@/src/services/recipes.service'
import { getSignedRecipePhotoUrl, getSignedAvatarUrl } from '@/src/services/storage.service'

// ── Carte recette ─────────────────────────────────────────────────
function RecipeCard({ recipe }: { recipe: FeedRecipe }) {
    const [photoUrl, setPhotoUrl] = useState<string | null>(null)
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

    useEffect(() => {
        if (!recipe.photo) return
        if (recipe.photo.startsWith('http')) { setPhotoUrl(recipe.photo); return }
        getSignedRecipePhotoUrl(recipe.photo).then(setPhotoUrl).catch(() => {})
    }, [recipe.photo])

    useEffect(() => {
        if (!recipe.creator.avatar) return
        if (recipe.creator.avatar.startsWith('http')) { setAvatarUrl(recipe.creator.avatar); return }
        getSignedAvatarUrl(recipe.creator.avatar).then(setAvatarUrl).catch(() => {})
    }, [recipe.creator.avatar])

    const totalTime = (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0)

    return (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => router.push({
                pathname: '/recipe/[recipeID]',
                params: { recipeID: recipe.recipeID.toString() },
            })}
        >
            {/* Photo */}
            {photoUrl ? (
                <Image source={{ uri: photoUrl }} style={styles.cardPhoto} />
            ) : (
                <View style={[styles.cardPhoto, styles.cardPhotoFallback]}>
                    <Text style={styles.cardPhotoInitial}>{recipe.name[0]?.toUpperCase()}</Text>
                </View>
            )}

            <View style={styles.cardBody}>
                {/* Créateur */}
                <View style={styles.creatorRow}>
                    {avatarUrl ? (
                        <Image source={{ uri: avatarUrl }} style={styles.creatorAvatar} />
                    ) : (
                        <View style={[styles.creatorAvatar, styles.creatorAvatarFallback]}>
                            <Text style={styles.creatorInitial}>
                                {recipe.creator.pseudo[0]?.toUpperCase()}
                            </Text>
                        </View>
                    )}
                    <Text style={styles.creatorPseudo}>@{recipe.creator.pseudo}</Text>
                </View>

                {/* Nom */}
                <Text style={styles.cardName} numberOfLines={2}>{recipe.name}</Text>

                {/* Méta */}
                <Text style={styles.cardMeta}>
                    {totalTime > 0 ? `${totalTime} min · ` : ''}
                    {recipe.ingredients.length} ingrédient{recipe.ingredients.length > 1 ? 's' : ''}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

// ── Écran principal ───────────────────────────────────────────────
type FeedItem =
    | { type: 'header'; title: string }
    | { type: 'recipe'; recipe: FeedRecipe }
    | { type: 'empty'; message: string }

export default function FeedScreen() {
    const [items, setItems] = useState<FeedItem[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    const load = useCallback(async () => {
        try {
            const { recent, random } = await getFeed()

            if (recent.length === 0 && random.length === 0) {
                setItems([{ type: 'empty', message: 'Ajoute des amis pour voir leurs recettes ici.' }])
                return
            }

            const built: FeedItem[] = []
            if (recent.length > 0) {
                built.push({ type: 'header', title: 'Nouvelles recettes' })
                recent.forEach(r => built.push({ type: 'recipe', recipe: r }))
            }
            if (random.length > 0) {
                built.push({ type: 'header', title: 'Découvrir' })
                random.forEach(r => built.push({ type: 'recipe', recipe: r }))
            }
            setItems(built)
        } catch {
            setItems([{ type: 'empty', message: 'Impossible de charger le fil.' }])
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }, [])

    useEffect(() => { load() }, [load])

    const onRefresh = useCallback(() => { setRefreshing(true); load() }, [load])

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Fil</Text>
            </View>

            {loading ? (
                <ActivityIndicator style={{ flex: 1 }} color={Colors.primaryLight} />
            ) : (
                <FlatList
                    data={items}
                    keyExtractor={(item, i) =>
                        item.type === 'recipe' ? `r-${item.recipe.recipeID}` : `${item.type}-${i}`
                    }
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primaryLight} />
                    }
                    renderItem={({ item }) => {
                        if (item.type === 'header') {
                            return <Text style={styles.sectionHeader}>{item.title}</Text>
                        }
                        if (item.type === 'empty') {
                            return (
                                <View style={styles.emptyState}>
                                    <View style={styles.emptyIcon}>
                                        <Users size={36} color={Colors.primaryMuted} />
                                    </View>
                                    <Text style={styles.emptyTitle}>Rien à voir pour l'instant</Text>
                                    <Text style={styles.emptyText}>{item.message}</Text>
                                </View>
                            )
                        }
                        return <RecipeCard recipe={item.recipe} />
                    }}
                />
            )}
        </SafeAreaView>
    )
}

const PHOTO_HEIGHT = 200
const AVATAR_SIZE = 28

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },

    header: {
        paddingHorizontal: Spacing.xl,
        paddingTop: Spacing.lg,
        paddingBottom: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    title: {
        fontSize: 32,
        fontWeight: FontWeight.bold,
        color: Colors.primary,
    },

    list: {
        paddingHorizontal: Spacing.xl,
        paddingTop: Spacing.md,
        paddingBottom: 32,
        gap: Spacing.sm,
    },

    sectionHeader: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.semibold,
        color: Colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginTop: Spacing.md,
        marginBottom: Spacing.xs,
    },

    // Carte
    card: {
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: Colors.border,
        overflow: 'hidden',
    },
    cardPhoto: {
        width: '100%',
        height: PHOTO_HEIGHT,
        resizeMode: 'cover',
    },
    cardPhotoFallback: {
        backgroundColor: Colors.cardLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardPhotoInitial: {
        fontSize: 64,
        fontWeight: FontWeight.bold,
        color: Colors.primaryMuted,
    },
    cardBody: {
        padding: Spacing.md,
        gap: Spacing.xs,
    },
    creatorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        marginBottom: 2,
    },
    creatorAvatar: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
    },
    creatorAvatarFallback: {
        backgroundColor: Colors.cardLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    creatorInitial: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.bold,
        color: Colors.primaryLight,
    },
    creatorPseudo: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.medium,
        color: Colors.primaryLight,
    },
    cardName: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: Colors.textPrimary,
        lineHeight: 22,
    },
    cardMeta: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        marginTop: 2,
    },

    // Empty state
    emptyState: {
        alignItems: 'center',
        paddingTop: 80,
        gap: Spacing.sm,
    },
    emptyIcon: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: Colors.cardLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.sm,
    },
    emptyTitle: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.bold,
        color: Colors.textPrimary,
    },
    emptyText: {
        fontSize: FontSize.md,
        color: Colors.textSecondary,
        textAlign: 'center',
        maxWidth: 260,
        lineHeight: 22,
    },
})
