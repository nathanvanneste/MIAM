import { useState, useCallback, useEffect, useRef } from 'react'
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, useWindowDimensions, Animated } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Users } from 'lucide-react-native'
import { Colors, FontSize, FontWeight, Spacing } from '@/src/constants'
import { FeedRecipe, getFeed } from '@/src/services/recipes.service'
import RecipeCard from '@/src/components/ui/Recipe/RecipeCard'
import SearchBar from '@/src/components/ui/SearchBar'
import { sortByMatch } from '@/src/utils/search'

const H_PAD = Spacing.md
const COL_GAP = Spacing.sm

type FeedItem =
    | { type: 'header'; title: string }
    | { type: 'pair'; items: FeedRecipe[] }
    | { type: 'empty'; message: string }

const toPairs = (recipes: FeedRecipe[]): FeedItem[] =>
    Array.from({ length: Math.ceil(recipes.length / 2) }, (_, i) => ({
        type: 'pair' as const,
        items: recipes.slice(i * 2, i * 2 + 2),
    }))

const buildItems = (recent: FeedRecipe[], random: FeedRecipe[], search: string): FeedItem[] => {
    if (recent.length === 0 && random.length === 0) {
        return [{ type: 'empty', message: 'Ajoute des amis pour voir leurs recettes ici.' }]
    }

    if (search.trim()) {
        const all = [...recent, ...random]
        const deduped = all.filter((r, i) => all.findIndex(x => x.recipeID === r.recipeID) === i)
        const filtered = sortByMatch(deduped, search, r => r.name)
        if (filtered.length === 0) return [{ type: 'empty', message: 'Aucune recette ne correspond.' }]
        return toPairs(filtered)
    }

    const built: FeedItem[] = []
    if (recent.length > 0) {
        built.push({ type: 'header', title: 'Nouvelles recettes' })
        built.push(...toPairs(recent))
    }
    if (random.length > 0) {
        built.push({ type: 'header', title: 'Découvrir' })
        built.push(...toPairs(random))
    }
    return built
}

export default function FeedScreen() {
    const { width } = useWindowDimensions()
    const cardWidth = (width - H_PAD * 2 - COL_GAP) / 2

    const [recent, setRecent] = useState<FeedRecipe[]>([])
    const [random, setRandom] = useState<FeedRecipe[]>([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [hasData, setHasData] = useState(false)
    const [headerHeight, setHeaderHeight] = useState(0)

    const translateY = useRef(new Animated.Value(0)).current
    const lastScrollY = useRef(0)
    const headerVisible = useRef(true)

    const showHeader = useCallback(() => {
        if (headerVisible.current) return
        headerVisible.current = true
        Animated.timing(translateY, { toValue: 0, duration: 200, useNativeDriver: true }).start()
    }, [translateY])

    const hideHeader = useCallback(() => {
        if (!headerVisible.current) return
        headerVisible.current = false
        Animated.timing(translateY, { toValue: -headerHeight, duration: 200, useNativeDriver: true }).start()
    }, [translateY, headerHeight])

    const handleScroll = useCallback((e: any) => {
        const y = e.nativeEvent.contentOffset.y
        const dy = y - lastScrollY.current
        lastScrollY.current = y
        if (dy > 5 && y > headerHeight) hideHeader()
        else if (dy < -5) showHeader()
    }, [headerHeight, hideHeader, showHeader])

    const load = useCallback(async () => {
        try {
            const data = await getFeed()
            setRecent(data.recent)
            setRandom(data.random)
            setHasData(true)
        } catch {
            setHasData(false)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }, [])

    useEffect(() => { load() }, [load])
    const onRefresh = useCallback(() => {
        showHeader()
        setRefreshing(true)
        load()
    }, [load, showHeader])

    const items: FeedItem[] = hasData
        ? buildItems(recent, random, search)
        : [{ type: 'empty', message: 'Impossible de charger le fil.' }]

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inner}>
                <Animated.View
                    style={[styles.header, { transform: [{ translateY }] }]}
                    onLayout={e => setHeaderHeight(e.nativeEvent.layout.height)}
                >
                    <Text style={styles.title}>Fil</Text>
                    <SearchBar
                        placeholder="Rechercher une recette..."
                        value={search}
                        onChangeText={t => { showHeader(); setSearch(t) }}
                    />
                </Animated.View>

            {loading ? (
                <ActivityIndicator style={{ flex: 1 }} color={Colors.primaryLight} />
            ) : (
                <FlatList
                    data={items}
                    keyExtractor={(item, i) =>
                        item.type === 'pair' ? `pair-${item.items[0].recipeID}` : `${item.type}-${i}`
                    }
                    contentContainerStyle={[styles.list, { paddingTop: headerHeight + Spacing.md }]}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    scrollEventThrottle={16}
                    onScroll={handleScroll}
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
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    inner: { flex: 1 },

    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        paddingHorizontal: Spacing.xl,
        paddingTop: Spacing.lg,
        paddingBottom: Spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        backgroundColor: Colors.background,
        gap: Spacing.sm,
    },
    title: {
        fontSize: 32,
        fontWeight: FontWeight.bold,
        color: Colors.primary,
    },

    list: {
        paddingHorizontal: H_PAD,
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
