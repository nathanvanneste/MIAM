import { useState, useEffect, useCallback } from 'react'
import {
    View, Text, ScrollView, TouchableOpacity, Modal, FlatList,
    StyleSheet, ActivityIndicator, Alert, Image,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeft, Pencil, X, Plus, Check, UserPlus, ChefHat, Users } from 'lucide-react-native'
import { router } from 'expo-router'
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '@/src/constants'
import { Group, GroupUser } from '@/src/types/group'
import { FriendUser } from '@/src/types/friend'
import { RecipeDetail } from '@/src/services/recipes.service'
import {
    getGroup, addRecipeToGroup, removeRecipeFromGroup,
    addMember, leaveGroup, updateGroup,
} from '@/src/services/groups.service'
import { getMyRecipes } from '@/src/services/recipes.service'
import { getMyRelations } from '@/src/services/friends.service'
import { getSignedAvatarUrl, getSignedRecipePhotoUrl } from '@/src/services/storage.service'

// ── Palette déterministe ──────────────────────────────────────────
const PALETTE = ['#FFE6CF', '#E2F9F7', '#E9FADB', '#F0CAA7', '#FBE9DC', '#EEE0FF']
function groupColor(name: string): string {
    let h = 0
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % PALETTE.length
    return PALETTE[Math.abs(h)]
}

// ── Avatar utilisateur ────────────────────────────────────────────
function UserAvatar({ user, size = 40 }: { user: GroupUser | FriendUser; size?: number }) {
    const [url, setUrl] = useState<string | null>(null)
    useEffect(() => {
        if (!user.avatar) return
        if (user.avatar.startsWith('http')) { setUrl(user.avatar); return }
        getSignedAvatarUrl(user.avatar).then(setUrl).catch(() => {})
    }, [user.avatar])

    const s = { width: size, height: size, borderRadius: size / 2 }
    if (url) return <Image source={{ uri: url }} style={s} />
    return (
        <View style={[s, styles.avatarFallback]}>
            <Text style={{ fontSize: size * 0.4, fontWeight: FontWeight.bold, color: Colors.primaryLight }}>
                {user.pseudo[0]?.toUpperCase()}
            </Text>
        </View>
    )
}

// ── Carte recette dans le groupe ──────────────────────────────────
function GroupRecipeCard({
    recipe,
    isEditing,
    onRemove,
}: {
    recipe: RecipeDetail
    isEditing: boolean
    onRemove: () => void
}) {
    const [photoUrl, setPhotoUrl] = useState<string | null>(null)
    useEffect(() => {
        if (!recipe.photo) return
        if (recipe.photo.startsWith('http')) { setPhotoUrl(recipe.photo); return }
        getSignedRecipePhotoUrl(recipe.photo).then(setPhotoUrl).catch(() => {})
    }, [recipe.photo])

    return (
        <TouchableOpacity
            style={styles.recipeCard}
            activeOpacity={isEditing ? 1 : 0.75}
            onPress={() => !isEditing && router.push({
                pathname: '/recipe/[recipeID]',
                params: { recipeID: recipe.recipeID.toString() },
            })}
        >
            {photoUrl ? (
                <Image source={{ uri: photoUrl }} style={styles.recipePhoto} />
            ) : (
                <View style={[styles.recipePhotoFallback, { backgroundColor: Colors.cardLight }]}>
                    <Text style={styles.recipeInitial}>{recipe.name[0]?.toUpperCase()}</Text>
                </View>
            )}
            <Text style={styles.recipeName} numberOfLines={2}>{recipe.name}</Text>
            <Text style={styles.recipeMeta}>{recipe.prepTime + recipe.cookTime} min</Text>

            {isEditing && (
                <TouchableOpacity style={styles.removeOverlay} onPress={onRemove} hitSlop={8}>
                    <X size={14} color={Colors.surface} />
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    )
}

// ── Écran principal ───────────────────────────────────────────────
type Tab = 'recipes' | 'members'

export default function GroupDetailScreen({ groupID }: { groupID: number }) {
    const [group, setGroup] = useState<Group | null>(null)
    const [loading, setLoading] = useState(true)
    const [tab, setTab] = useState<Tab>('recipes')
    const [isEditing, setIsEditing] = useState(false)
    const [showAddRecipe, setShowAddRecipe] = useState(false)
    const [showAddMember, setShowAddMember] = useState(false)

    const load = useCallback(async () => {
        try {
            const g = await getGroup(groupID)
            setGroup(g)
        } catch {
            Alert.alert('Erreur', 'Impossible de charger le groupe.')
            router.back()
        } finally {
            setLoading(false)
        }
    }, [groupID])

    useEffect(() => { load() }, [load])

    const handleRemoveRecipe = async (recipeID: number) => {
        if (!group) return
        const previous = group
        setGroup({ ...group, recipes: group.recipes.filter(r => r.recipeID !== recipeID) })
        try {
            await removeRecipeFromGroup(groupID, recipeID)
        } catch {
            setGroup(previous)
            Alert.alert('Erreur', 'Impossible de retirer cette recette.')
        }
    }

    const handleRecipeAdded = (recipeID: number) => {
        load()
        setShowAddRecipe(false)
    }

    const handleMemberAdded = () => {
        load()
        setShowAddMember(false)
    }

    const handleLeave = () => {
        Alert.alert(
            'Quitter le groupe',
            `Es-tu sûr de vouloir quitter "${group?.name}" ?`,
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Quitter', style: 'destructive',
                    onPress: async () => {
                        try {
                            await leaveGroup(groupID)
                            router.back()
                        } catch (e: any) {
                            Alert.alert('Erreur', e.message ?? 'Impossible de quitter le groupe.')
                        }
                    },
                },
            ]
        )
    }

    if (loading || !group) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator style={{ flex: 1 }} color={Colors.primaryLight} />
            </SafeAreaView>
        )
    }

    const groupBg = groupColor(group.name)
    const groupInitial = group.name.trim()[0]?.toUpperCase() ?? '?'

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <ArrowLeft size={22} color={Colors.textPrimary} />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <View style={[styles.headerAvatar, { backgroundColor: groupBg }]}>
                        <Text style={styles.headerAvatarText}>{groupInitial}</Text>
                    </View>
                    <Text style={styles.headerTitle} numberOfLines={1}>{group.name}</Text>
                </View>
                <TouchableOpacity
                    onPress={() => setIsEditing(v => !v)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    {isEditing
                        ? <X size={22} color={Colors.primaryLight} />
                        : <Pencil size={20} color={Colors.textPrimary} />
                    }
                </TouchableOpacity>
            </View>

            {/* Membres row (toujours visible) */}
            <View style={styles.membersStrip}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.membersRow}>
                    {group.members.map(m => (
                        <View key={m.userID} style={styles.memberChip}>
                            <UserAvatar user={m.user} size={32} />
                            <Text style={styles.memberChipName} numberOfLines={1}>@{m.user.pseudo}</Text>
                        </View>
                    ))}
                </ScrollView>
            </View>

            {/* Tabs */}
            <View style={styles.tabBar}>
                <TouchableOpacity
                    style={[styles.tab, tab === 'recipes' && styles.tabActive]}
                    onPress={() => setTab('recipes')}
                >
                    <ChefHat size={16} color={tab === 'recipes' ? Colors.primary : Colors.textSecondary} />
                    <Text style={[styles.tabText, tab === 'recipes' && styles.tabTextActive]}>
                        Recettes {group.recipes.length > 0 ? `(${group.recipes.length})` : ''}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, tab === 'members' && styles.tabActive]}
                    onPress={() => setTab('members')}
                >
                    <Users size={16} color={tab === 'members' ? Colors.primary : Colors.textSecondary} />
                    <Text style={[styles.tabText, tab === 'members' && styles.tabTextActive]}>
                        Membres ({group.members.length})
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Contenu */}
            {tab === 'recipes' ? (
                <ScrollView contentContainerStyle={styles.tabContent} showsVerticalScrollIndicator={false}>
                    {isEditing && (
                        <TouchableOpacity style={styles.addRowBtn} onPress={() => setShowAddRecipe(true)}>
                            <Plus size={18} color={Colors.primaryButton} />
                            <Text style={styles.addRowBtnText}>Partager une de mes recettes</Text>
                        </TouchableOpacity>
                    )}

                    {group.recipes.length === 0 ? (
                        <View style={styles.tabEmpty}>
                            <ChefHat size={36} color={Colors.primaryMuted} />
                            <Text style={styles.tabEmptyTitle}>Aucune recette partagée</Text>
                            <Text style={styles.tabEmptyText}>
                                {isEditing
                                    ? 'Appuie sur "Partager une recette" pour en ajouter'
                                    : 'Active le mode édition pour partager une recette'
                                }
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.recipesGrid}>
                            {group.recipes.map(gr => (
                                <GroupRecipeCard
                                    key={gr.recipeID}
                                    recipe={gr.recipe as RecipeDetail}
                                    isEditing={isEditing}
                                    onRemove={() => handleRemoveRecipe(gr.recipeID)}
                                />
                            ))}
                        </View>
                    )}
                </ScrollView>
            ) : (
                <ScrollView contentContainerStyle={styles.tabContent} showsVerticalScrollIndicator={false}>
                    {isEditing && (
                        <TouchableOpacity style={styles.addRowBtn} onPress={() => setShowAddMember(true)}>
                            <UserPlus size={18} color={Colors.primaryButton} />
                            <Text style={styles.addRowBtnText}>Inviter un ami</Text>
                        </TouchableOpacity>
                    )}

                    {group.members.map(m => (
                        <View key={m.userID} style={styles.memberRow}>
                            <UserAvatar user={m.user} size={46} />
                            <View style={styles.memberInfo}>
                                <Text style={styles.memberPseudo}>@{m.user.pseudo}</Text>
                                <Text style={styles.memberName}>{m.user.firstName} {m.user.lastName}</Text>
                            </View>
                        </View>
                    ))}

                    <TouchableOpacity style={styles.leaveBtn} onPress={handleLeave}>
                        <Text style={styles.leaveBtnText}>Quitter le groupe</Text>
                    </TouchableOpacity>
                </ScrollView>
            )}

            {/* Modal ajout recette */}
            <AddRecipeModal
                visible={showAddRecipe}
                groupID={groupID}
                existingRecipeIDs={new Set(group.recipes.map(r => r.recipeID))}
                onClose={() => setShowAddRecipe(false)}
                onAdded={handleRecipeAdded}
            />

            {/* Modal ajout membre */}
            <AddMemberModal
                visible={showAddMember}
                groupID={groupID}
                existingMemberIDs={new Set(group.members.map(m => m.userID))}
                onClose={() => setShowAddMember(false)}
                onAdded={handleMemberAdded}
            />
        </SafeAreaView>
    )
}

// ── Modal ajout de recette ────────────────────────────────────────
function AddRecipeModal({
    visible, groupID, existingRecipeIDs, onClose, onAdded,
}: {
    visible: boolean
    groupID: number
    existingRecipeIDs: Set<number>
    onClose: () => void
    onAdded: (recipeID: number) => void
}) {
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
            onAdded(recipeID)
        } catch {
            Alert.alert('Erreur', 'Impossible d\'ajouter cette recette.')
        } finally {
            setAdding(null)
        }
    }

    const available = recipes.filter(r => !existingRecipeIDs.has(r.recipeID))

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <SafeAreaView style={styles.modal}>
                <View style={styles.modalHeader}>
                    <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        <X size={22} color={Colors.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Mes recettes</Text>
                    <View style={{ width: 22 }} />
                </View>

                {loading ? (
                    <ActivityIndicator style={{ flex: 1 }} color={Colors.primaryLight} />
                ) : (
                    <FlatList
                        data={available}
                        keyExtractor={r => String(r.recipeID)}
                        contentContainerStyle={styles.modalList}
                        ListEmptyComponent={
                            <View style={styles.tabEmpty}>
                                <Text style={styles.tabEmptyTitle}>Toutes tes recettes sont déjà dans le groupe</Text>
                            </View>
                        }
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.recipePickRow}
                                onPress={() => handleAdd(item.recipeID)}
                                disabled={adding === item.recipeID}
                            >
                                <View style={styles.recipePickInfo}>
                                    <Text style={styles.recipePickName} numberOfLines={1}>{item.name}</Text>
                                    <Text style={styles.recipePickMeta}>
                                        {item.ingredients.length} ingrédient{item.ingredients.length > 1 ? 's' : ''} · {item.prepTime + item.cookTime} min
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

// ── Modal ajout de membre ─────────────────────────────────────────
function AddMemberModal({
    visible, groupID, existingMemberIDs, onClose, onAdded,
}: {
    visible: boolean
    groupID: number
    existingMemberIDs: Set<string>
    onClose: () => void
    onAdded: () => void
}) {
    const [friends, setFriends] = useState<FriendUser[]>([])
    const [loading, setLoading] = useState(false)
    const [adding, setAdding] = useState<string | null>(null)

    useEffect(() => {
        if (!visible) return
        setLoading(true)
        getMyRelations()
            .then(r => setFriends(r.friends))
            .catch(() => setFriends([]))
            .finally(() => setLoading(false))
    }, [visible])

    const handleAdd = async (userID: string) => {
        setAdding(userID)
        try {
            await addMember(groupID, userID)
            onAdded()
        } catch {
            Alert.alert('Erreur', 'Impossible d\'ajouter ce membre.')
        } finally {
            setAdding(null)
        }
    }

    const available = friends.filter(f => !existingMemberIDs.has(f.userID))

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <SafeAreaView style={styles.modal}>
                <View style={styles.modalHeader}>
                    <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        <X size={22} color={Colors.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Inviter un ami</Text>
                    <View style={{ width: 22 }} />
                </View>

                {loading ? (
                    <ActivityIndicator style={{ flex: 1 }} color={Colors.primaryLight} />
                ) : (
                    <FlatList
                        data={available}
                        keyExtractor={f => f.userID}
                        contentContainerStyle={styles.modalList}
                        ListEmptyComponent={
                            <View style={styles.tabEmpty}>
                                <Text style={styles.tabEmptyTitle}>Tous tes amis sont déjà dans le groupe</Text>
                            </View>
                        }
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.recipePickRow}
                                onPress={() => handleAdd(item.userID)}
                                disabled={adding === item.userID}
                            >
                                <UserAvatar user={item} size={44} />
                                <View style={styles.recipePickInfo}>
                                    <Text style={styles.recipePickName}>@{item.pseudo}</Text>
                                    <Text style={styles.recipePickMeta}>{item.firstName} {item.lastName}</Text>
                                </View>
                                {adding === item.userID
                                    ? <ActivityIndicator size="small" color={Colors.primaryLight} />
                                    : <UserPlus size={20} color={Colors.primary} />
                                }
                            </TouchableOpacity>
                        )}
                    />
                )}
            </SafeAreaView>
        </Modal>
    )
}

const RECIPE_CARD_W = 148

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    headerCenter: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginHorizontal: Spacing.md,
    },
    headerAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerAvatarText: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.bold,
        color: Colors.primary,
    },
    headerTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: Colors.textPrimary,
        flex: 1,
    },

    // Members strip
    membersStrip: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        paddingVertical: Spacing.sm,
    },
    membersRow: {
        paddingHorizontal: Spacing.xl,
        gap: Spacing.sm,
    },
    memberChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        backgroundColor: Colors.cardLight,
        borderRadius: BorderRadius.full,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
    },
    memberChipName: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.medium,
        color: Colors.primary,
        maxWidth: 80,
    },

    // Tabs
    tabBar: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.xs,
        paddingVertical: Spacing.md,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabActive: {
        borderBottomColor: Colors.primary,
    },
    tabText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.medium,
        color: Colors.textSecondary,
    },
    tabTextActive: {
        color: Colors.primary,
        fontWeight: FontWeight.semibold,
    },

    tabContent: {
        padding: Spacing.xl,
        paddingBottom: 40,
    },

    // Add row button
    addRowBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        borderWidth: 1.5,
        borderColor: Colors.primaryButton,
        borderRadius: BorderRadius.md,
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        marginBottom: Spacing.md,
        justifyContent: 'center',
    },
    addRowBtnText: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
        color: Colors.primaryButton,
    },

    // Recipe grid
    recipesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    recipeCard: {
        width: RECIPE_CARD_W,
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.border,
        overflow: 'hidden',
    },
    recipePhoto: {
        width: '100%',
        height: RECIPE_CARD_W * 0.65,
        resizeMode: 'cover',
    },
    recipePhotoFallback: {
        width: '100%',
        height: RECIPE_CARD_W * 0.65,
        alignItems: 'center',
        justifyContent: 'center',
    },
    recipeInitial: {
        fontSize: FontSize.xxxxl,
        fontWeight: FontWeight.bold,
        color: Colors.primaryMuted,
    },
    recipeName: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: Colors.textPrimary,
        paddingHorizontal: Spacing.sm,
        paddingTop: Spacing.xs,
    },
    recipeMeta: {
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

    // Tab empty
    tabEmpty: {
        alignItems: 'center',
        paddingVertical: 40,
        gap: Spacing.sm,
    },
    tabEmptyTitle: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
        color: Colors.textPrimary,
        textAlign: 'center',
    },
    tabEmptyText: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        textAlign: 'center',
    },

    // Members tab
    memberRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.border,
        padding: Spacing.md,
        marginBottom: Spacing.sm,
    },
    memberInfo: { flex: 1 },
    memberPseudo: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
        color: Colors.textPrimary,
    },
    memberName: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        marginTop: 2,
    },

    // Leave button
    leaveBtn: {
        alignItems: 'center',
        paddingVertical: Spacing.lg,
        marginTop: Spacing.xl,
    },
    leaveBtnText: {
        fontSize: FontSize.sm,
        color: Colors.error,
    },

    // Avatar
    avatarFallback: {
        backgroundColor: Colors.cardLight,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Modal
    modal: { flex: 1, backgroundColor: Colors.background },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    modalTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.semibold,
        color: Colors.textPrimary,
    },
    modalList: {
        padding: Spacing.xl,
        gap: Spacing.sm,
    },

    recipePickRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.border,
        padding: Spacing.md,
    },
    recipePickInfo: { flex: 1 },
    recipePickName: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
        color: Colors.textPrimary,
    },
    recipePickMeta: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        marginTop: 2,
    },
})
