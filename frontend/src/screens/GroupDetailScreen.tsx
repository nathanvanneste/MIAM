import { useState, useEffect, useCallback } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeft, Pencil, X, Plus, UserPlus, ChefHat, Users } from 'lucide-react-native'
import { router } from 'expo-router'
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '@/src/constants'
import { Group } from '@/src/types/group'
import { RecipeDetail } from '@/src/services/recipes.service'
import { getGroup, removeRecipeFromGroup, leaveGroup } from '@/src/services/groups.service'
import { groupColor } from '@/src/utils/groupColor'
import UserAvatar from '@/src/components/ui/UserAvatar'
import GroupRecipeCard from '@/src/components/features/group/GroupRecipeCard'
import AddRecipeModal from '@/src/components/features/group/AddRecipeModal'
import AddMemberModal from '@/src/components/features/group/AddMemberModal'

type Tab = 'recipes' | 'members'

export default function GroupDetailScreen({ groupID }: { groupID: number }) {
    const [group, setGroup] = useState<Group | null>(null)
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
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
            setRefreshing(false)
        }
    }, [groupID])

    const onRefresh = useCallback(() => { setRefreshing(true); load() }, [load])

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

    const handleRecipeAdded = () => {
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
                <ScrollView
                    contentContainerStyle={styles.tabContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primaryLight} />}
                >
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
                <ScrollView
                    contentContainerStyle={styles.tabContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primaryLight} />}
                >
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

            <AddRecipeModal
                visible={showAddRecipe}
                groupID={groupID}
                existingRecipeIDs={new Set(group.recipes.map(r => r.recipeID))}
                onClose={() => setShowAddRecipe(false)}
                onAdded={handleRecipeAdded}
            />

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

    recipesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },

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

    leaveBtn: {
        alignItems: 'center',
        paddingVertical: Spacing.lg,
        marginTop: Spacing.xl,
    },
    leaveBtnText: {
        fontSize: FontSize.sm,
        color: Colors.error,
    },
})
