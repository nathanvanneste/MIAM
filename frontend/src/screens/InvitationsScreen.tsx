import { useState, useEffect, useCallback } from 'react'
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, ActivityIndicator, Image, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeft, Check, X } from 'lucide-react-native'
import { router } from 'expo-router'
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '@/src/constants'
import { InvitationWithUser } from '@/src/types/friend'
import { getMyRelations, acceptFriendship, rejectFriendship } from '@/src/services/friends.service'
import { getSignedAvatarUrl } from '@/src/services/storage.service'

function Avatar({ user }: { user: InvitationWithUser['user'] }) {
    const [url, setUrl] = useState<string | null>(null)
    useEffect(() => {
        if (user.avatar && !user.avatar.startsWith('http')) {
            getSignedAvatarUrl(user.avatar).then(setUrl).catch(() => {})
        } else if (user.avatar) {
            setUrl(user.avatar)
        }
    }, [user.avatar])

    if (url) return <Image source={{ uri: url }} style={styles.avatar} />
    return (
        <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitial}>{user.pseudo[0]?.toUpperCase()}</Text>
        </View>
    )
}

export default function InvitationsScreen() {
    const [invitations, setInvitations] = useState<InvitationWithUser[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [processing, setProcessing] = useState<string | null>(null)

    const load = useCallback(async () => {
        setLoading(true)
        try {
            const { invitations: inv } = await getMyRelations()
            setInvitations(inv)
        } catch {
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }, [])

    const onRefresh = useCallback(() => { setRefreshing(true); load() }, [load])

    useEffect(() => { load() }, [load])

    const handleAccept = async (inv: InvitationWithUser) => {
        setProcessing(inv.requesterID)
        try {
            await acceptFriendship(inv.requesterID, inv.receiverID)
            setInvitations(prev => prev.filter(i => i.requesterID !== inv.requesterID))
        } catch {
            Alert.alert('Erreur', "Impossible d'accepter l'invitation.")
        } finally {
            setProcessing(null)
        }
    }

    const handleReject = async (inv: InvitationWithUser) => {
        setProcessing(inv.requesterID)
        try {
            await rejectFriendship(inv.requesterID, inv.receiverID)
            setInvitations(prev => prev.filter(i => i.requesterID !== inv.requesterID))
        } catch {
            Alert.alert('Erreur', "Impossible de refuser l'invitation.")
        } finally {
            setProcessing(null)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <ArrowLeft size={22} color={Colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    Invitations{invitations.length > 0 ? ` (${invitations.length})` : ''}
                </Text>
                <View style={{ width: 22 }} />
            </View>

            {loading ? (
                <ActivityIndicator style={{ flex: 1 }} color={Colors.primaryLight} />
            ) : (
                <FlatList
                    data={invitations}
                    keyExtractor={inv => inv.requesterID}
                    contentContainerStyle={styles.list}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primaryLight} />}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyTitle}>Aucune invitation en attente</Text>
                            <Text style={styles.emptySubtitle}>Les demandes d'amis apparaîtront ici</Text>
                        </View>
                    }
                    renderItem={({ item }) => {
                        const isProcessing = processing === item.requesterID
                        return (
                            <View style={styles.card}>
                                <Avatar user={item.user} />
                                <View style={styles.userInfo}>
                                    <Text style={styles.pseudo}>@{item.user.pseudo}</Text>
                                    <Text style={styles.name}>{item.user.firstName} {item.user.lastName}</Text>
                                </View>
                                {isProcessing ? (
                                    <ActivityIndicator size="small" color={Colors.primaryLight} />
                                ) : (
                                    <View style={styles.actions}>
                                        <TouchableOpacity
                                            style={styles.acceptBtn}
                                            onPress={() => handleAccept(item)}
                                        >
                                            <Check size={18} color={Colors.surface} />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.rejectBtn}
                                            onPress={() => handleReject(item)}
                                        >
                                            <X size={18} color={Colors.textSecondary} />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        )
                    }}
                />
            )}
        </SafeAreaView>
    )
}

const AVATAR_SIZE = 50

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
    headerTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.semibold,
        color: Colors.textPrimary,
    },

    list: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.md, paddingBottom: Spacing.xl },

    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.border,
        padding: Spacing.md,
        marginBottom: Spacing.sm,
        gap: Spacing.md,
    },

    avatar: { width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE / 2 },
    avatarPlaceholder: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
        backgroundColor: Colors.cardLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarInitial: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.primaryLight },

    userInfo: { flex: 1 },
    pseudo: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
    name: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },

    actions: { flexDirection: 'row', gap: Spacing.sm },
    acceptBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: Colors.darkGreen,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rejectBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },

    emptyState: { alignItems: 'center', marginTop: 60 },
    emptyTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: Colors.textPrimary, marginBottom: Spacing.xs },
    emptySubtitle: { fontSize: FontSize.md, color: Colors.textSecondary },
})
