import { useState, useCallback, useEffect } from 'react'
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, useWindowDimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Users } from 'lucide-react-native'
import { Colors, FontSize, FontWeight, Spacing } from '@/src/constants'
import { FeedRecipe, getFeed, getRecommendations } from '@/src/services/recipes.service'
import RecipeCard from '@/src/components/ui/Recipe/RecipeCard'

const H_PAD = Spacing.md
const COL_GAP = Spacing.sm

type FeedItem =
    | { type: 'header'; title: string }
    | { type: 'pair'; items: FeedRecipe[] }
    | { type: 'recipe'; recipe: FeedRecipe }
    | { type: 'empty'; message: string }

const toPairs = (recipes: FeedRecipe[]): FeedItem[] =>
    Array.from({ length: Math.ceil(recipes.length / 2) }, (_, i) => ({
        type: 'pair' as const,
        items: recipes.slice(i * 2, i * 2 + 2),
    }))

export default function FeedScreen() {
    const { width } = useWindowDimensions()
    const cardWidth = (width - H_PAD * 2 - COL_GAP) / 2

    const [items, setItems] = useState<FeedItem[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    const load = useCallback(async () => {
        try {
            const { recent, random } = await getFeed()
            const recRes = await getRecommendations().catch(() => ({ recommendations: [], preferencesCount: 0 }))

            const recs = recRes.recommendations || []

            if (recent.length === 0 && recs.length === 0 && random.length === 0) {
                setItems([{ type: 'empty', message: 'Ajoute des amis pour voir leurs recettes ici.' }])
                return
            }

            const built: FeedItem[] = []
            if (recent.length > 0) {
                built.push({ type: 'header', title: 'Nouvelles recettes' })
                recent.forEach((r: any) => built.push({ type: 'recipe', recipe: r }))
            }

            // Recommended recipes (from seed) have priority in the Discover section
            if (recs.length > 0) {
                built.push({ type: 'header', title: 'Découvrir' })
                recs.forEach((r: any) => built.push({ type: 'recipe', recipe: r }))
            } else if (random.length > 0) {
                built.push({ type: 'header', title: 'Découvrir' })
                built.push(...toPairs(random))
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
                        item.type === 'pair' ? `pair-${item.items[0].recipeID}` : item.type === 'recipe' ? `recipe-${item.recipe.recipeID}` : `${item.type}-${i}`
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
                                    <Text style={styles.emptyTitle}>Rien à voir pour l&apos;instant</Text>
                                    <Text style={styles.emptyText}>{item.message}</Text>
                                </View>
                            )
                        }
                        if (item.type === 'recipe') {
                            return (
                                <RecipeCard
                                    recipe={item.recipe}
                                    cardWidth={cardWidth}
                                    creator={item.recipe.creator}
                                />
                            )
                        }
                        return (
                            <View style={styles.pair}>
                                {item.items.map(r => (
                                    <RecipeCard
                                        key={r.recipeID}
                                        recipe={r}
                                        cardWidth={cardWidth}
                                        creator={r.creator}
                                    />
                                ))}
                                {item.items.length < 2 && <View style={{ width: cardWidth }} />}
                            </View>
                        )
                    }}
                />
            )}
        </SafeAreaView>
    )
}

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
        paddingHorizontal: H_PAD,
        paddingTop: Spacing.md,
        paddingBottom: 32,
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

    pair: {
        flexDirection: 'row',
        gap: COL_GAP,
    },

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
