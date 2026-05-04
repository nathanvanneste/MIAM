import { useState, useCallback, useEffect } from 'react'
import {
    View, Text, ScrollView, TouchableOpacity, Modal, TextInput,
    StyleSheet, ActivityIndicator, Alert, FlatList, Image, RefreshControl,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Plus, X, Check, Users } from 'lucide-react-native'
import { router } from 'expo-router'
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, ComponentSize } from '@/src/constants'
import { Group } from '@/src/types/group'
import { FriendUser } from '@/src/types/friend'
import { getMyGroups, createGroup } from '@/src/services/groups.service'
import { getMyRelations } from '@/src/services/friends.service'
import { getSignedAvatarUrl } from '@/src/services/storage.service'
import GroupCard from '@/src/components/ui/Group/GroupCard'

// ── Avatar ami ────────────────────────────────────────────────────
function FriendAvatar({ user, size = 40 }: { user: FriendUser; size?: number }) {
    const [url, setUrl] = useState<string | null>(null)
    useEffect(() => {
        if (!user.avatar) return
        if (user.avatar.startsWith('http')) { setUrl(user.avatar); return }
        getSignedAvatarUrl(user.avatar).then(setUrl).catch(() => {})
    }, [user.avatar])

    const style = { width: size, height: size, borderRadius: size / 2 }
    if (url) return <Image source={{ uri: url }} style={style} />
    return (
        <View style={[style, styles.avatarPlaceholder]}>
            <Text style={[styles.avatarInitial, { fontSize: size * 0.38 }]}>
                {user.pseudo[0]?.toUpperCase()}
            </Text>
        </View>
    )
}

// ── Écran principal ───────────────────────────────────────────────
export default function GroupsScreen() {
    const [groups, setGroups] = useState<Group[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [showCreate, setShowCreate] = useState(false)

    const load = useCallback(async () => {
        setLoading(true)
        try {
            const g = await getMyGroups()
            setGroups(g)
        } catch {
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }, [])

    const onRefresh = useCallback(() => { setRefreshing(true); load() }, [load])

    useEffect(() => { load() }, [load])

    const handleCreated = (group: Group) => {
        setGroups(prev => [group, ...prev])
        setShowCreate(false)
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Mes groupes</Text>
                <TouchableOpacity
                    style={styles.headerBtn}
                    onPress={() => setShowCreate(true)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <Plus size={22} color={Colors.surface} />
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator style={{ flex: 1 }} color={Colors.primaryLight} />
            ) : groups.length === 0 ? (
                <View style={styles.emptyState}>
                    <View style={styles.emptyIcon}>
                        <Users size={40} color={Colors.primaryMuted} />
                    </View>
                    <Text style={styles.emptyTitle}>Aucun groupe</Text>
                    <Text style={styles.emptySub}>Crée un groupe pour partager des recettes avec tes amis</Text>
                    <TouchableOpacity style={styles.emptyBtn} onPress={() => setShowCreate(true)}>
                        <Plus size={16} color={Colors.surface} />
                        <Text style={styles.emptyBtnText}>Créer un groupe</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primaryLight} />}
                >
                    {groups.map(group => (
                        <GroupCard
                            key={group.groupID}
                            name={group.name}
                            membersCount={group.members.length}
                            recipesCount={group.recipes.length}
                            onPress={() => router.push({
                                pathname: '/group/[groupID]',
                                params: { groupID: group.groupID.toString() },
                            })}
                        />
                    ))}
                </ScrollView>
            )}

            {/* Modal création */}
            <CreateGroupModal
                visible={showCreate}
                onClose={() => setShowCreate(false)}
                onCreated={handleCreated}
            />
        </SafeAreaView>
    )
}

// ── Modal création de groupe ──────────────────────────────────────
function CreateGroupModal({
    visible,
    onClose,
    onCreated,
}: {
    visible: boolean
    onClose: () => void
    onCreated: (group: Group) => void
}) {
    const [name, setName] = useState('')
    const [friends, setFriends] = useState<FriendUser[]>([])
    const [selected, setSelected] = useState<Set<string>>(new Set())
    const [loadingFriends, setLoadingFriends] = useState(false)
    const [creating, setCreating] = useState(false)

    useEffect(() => {
        if (!visible) return
        setName('')
        setSelected(new Set())
        setLoadingFriends(true)
        getMyRelations()
            .then(r => setFriends(r.friends))
            .catch(() => setFriends([]))
            .finally(() => setLoadingFriends(false))
    }, [visible])

    const toggle = (userID: string) => {
        setSelected(prev => {
            const next = new Set(prev)
            next.has(userID) ? next.delete(userID) : next.add(userID)
            return next
        })
    }

    const handleCreate = async () => {
        if (!name.trim()) { Alert.alert('Erreur', 'Le nom du groupe est obligatoire.'); return }
        setCreating(true)
        try {
            const group = await createGroup(name.trim(), [...selected])
            onCreated(group)
        } catch {
            Alert.alert('Erreur', 'Impossible de créer le groupe.')
        } finally {
            setCreating(false)
        }
    }

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <SafeAreaView style={styles.modal}>
                {/* Header modal */}
                <View style={styles.modalHeader}>
                    <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        <X size={22} color={Colors.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Nouveau groupe</Text>
                    <View style={{ width: 22 }} />
                </View>

                <ScrollView contentContainerStyle={styles.modalScroll} keyboardShouldPersistTaps="handled">
                    {/* Nom du groupe */}
                    <Text style={styles.fieldLabel}>Nom du groupe</Text>
                    <TextInput
                        style={styles.nameInput}
                        placeholder="Ex: Famille, Coloc, Amis..."
                        placeholderTextColor={Colors.textSecondary}
                        value={name}
                        onChangeText={setName}
                        autoFocus
                        multiline={false}
                    />

                    {/* Sélection d'amis */}
                    <Text style={styles.fieldLabel}>
                        Ajouter des amis
                        {selected.size > 0 && (
                            <Text style={styles.selectedCount}> · {selected.size} sélectionné{selected.size > 1 ? 's' : ''}</Text>
                        )}
                    </Text>

                    {loadingFriends ? (
                        <ActivityIndicator color={Colors.primaryLight} style={{ marginTop: Spacing.md }} />
                    ) : friends.length === 0 ? (
                        <View style={styles.noFriends}>
                            <Text style={styles.noFriendsText}>Tu n'as pas encore d'amis ajoutés.</Text>
                            <Text style={styles.noFriendsText}>Ajoute des amis depuis ton profil.</Text>
                        </View>
                    ) : (
                        friends.map(friend => {
                            const isSelected = selected.has(friend.userID)
                            return (
                                <TouchableOpacity
                                    key={friend.userID}
                                    style={[styles.friendRow, isSelected && styles.friendRowSelected]}
                                    onPress={() => toggle(friend.userID)}
                                    activeOpacity={0.7}
                                >
                                    <FriendAvatar user={friend} size={44} />
                                    <View style={styles.friendInfo}>
                                        <Text style={styles.friendPseudo}>@{friend.pseudo}</Text>
                                        <Text style={styles.friendName}>{friend.firstName} {friend.lastName}</Text>
                                    </View>
                                    <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                                        {isSelected && <Check size={14} color={Colors.surface} />}
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    )}
                </ScrollView>

                {/* Bouton créer */}
                <View style={styles.modalFooter}>
                    <TouchableOpacity
                        style={[styles.createBtn, creating && styles.createBtnDisabled]}
                        onPress={handleCreate}
                        disabled={creating}
                    >
                        {creating
                            ? <ActivityIndicator color={Colors.surface} />
                            : <Text style={styles.createBtnText}>Créer le groupe</Text>
                        }
                    </TouchableOpacity>
                </View>
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
        paddingTop: Spacing.md,
        paddingBottom: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    headerTitle: {
        fontSize: FontSize.xxxl,
        fontWeight: FontWeight.bold,
        color: Colors.textPrimary,
    },
    headerBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },

    list: {
        padding: Spacing.xl,
        gap: Spacing.sm,
    },

    // Empty state
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing.xl,
        gap: Spacing.sm,
    },
    emptyIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
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
    emptySub: {
        fontSize: FontSize.md,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
    },
    emptyBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        backgroundColor: Colors.primary,
        borderRadius: BorderRadius.full,
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.sm,
        marginTop: Spacing.md,
    },
    emptyBtnText: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
        color: Colors.surface,
    },

    // Avatar
    avatarPlaceholder: {
        backgroundColor: Colors.cardLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarInitial: {
        fontWeight: FontWeight.bold,
        color: Colors.primaryLight,
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
    modalScroll: {
        paddingHorizontal: Spacing.xl,
        paddingTop: Spacing.xl,
        paddingBottom: 120,
    },
    modalFooter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.md,
        backgroundColor: Colors.surface,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },

    fieldLabel: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.semibold,
        color: Colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: Spacing.sm,
        marginTop: Spacing.lg,
    },
    selectedCount: {
        color: Colors.primaryLight,
        textTransform: 'none',
        letterSpacing: 0,
    },

    nameInput: {
        height: ComponentSize.inputHeight,
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.border,
        paddingHorizontal: Spacing.md,
        fontSize: FontSize.md,
        color: Colors.textPrimary,
    },

    noFriends: {
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.border,
        padding: Spacing.lg,
        alignItems: 'center',
        gap: 4,
    },
    noFriendsText: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
    },

    friendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.border,
        padding: Spacing.sm,
        marginBottom: Spacing.sm,
        gap: Spacing.sm,
    },
    friendRowSelected: {
        borderColor: Colors.primaryLight,
        backgroundColor: '#FFF5F5',
    },
    friendInfo: { flex: 1 },
    friendPseudo: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
        color: Colors.textPrimary,
    },
    friendName: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    checkbox: {
        width: 26,
        height: 26,
        borderRadius: 13,
        borderWidth: 2,
        borderColor: Colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxSelected: {
        backgroundColor: Colors.primaryLight,
        borderColor: Colors.primaryLight,
    },

    createBtn: {
        height: ComponentSize.buttonHeight,
        backgroundColor: Colors.primary,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    createBtnDisabled: { opacity: 0.6 },
    createBtnText: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.bold,
        color: Colors.surface,
    },
})
