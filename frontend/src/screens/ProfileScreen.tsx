import { useEffect, useState, useCallback, useRef } from "react";
import { Text, StyleSheet, ScrollView, TouchableOpacity, View, RefreshControl, Alert } from "react-native";
import SearchBar from "../components/ui/SearchBar";
import RecipeCard from "../components/ui/Recipe/RecipeCard";
import { Colors } from "../constants/colors";
import { FontSize, FontWeight } from "../constants/typography";
import { Spacing, BorderRadius } from "../constants/spacing";
import { Settings, Trash2 } from "lucide-react-native";
import type { Recipe } from "../types/recipe";
import Grid from "../components/ui/Recipe/RecipeGrid";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileDescription from "../components/ui/Profile/ProfileDescription";
import { router, useFocusEffect } from "expo-router";
import { getSignedAvatarUrl } from "../services/storage.service";
import { getMe, getMySavedRecipes, type User, type SavedRecipeItem } from "../services/users.service";
import { getMyRecipes, deleteRecipe } from "../services/recipes.service";
import { getMyRelations } from "../services/friends.service";
import { sortByMatch } from "../utils/search";

export default function ProfileScreen() {
    const [search, setSearch] = useState("");
    const [user, setUser] = useState<User | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [savedRecipes, setSavedRecipes] = useState<SavedRecipeItem[]>([]);
    const [friendsCount, setFriendsCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedIDs, setSelectedIDs] = useState<Set<number>>(new Set());
    const isSelecting = selectedIDs.size > 0;

    const loadProfile = useCallback(async () => {
        try {
            const [me, myRecipes, saved, relations] = await Promise.all([
                getMe(),
                getMyRecipes(),
                getMySavedRecipes(),
                getMyRelations().catch(() => ({ friends: [], invitations: [], sentPending: [], myID: '' })),
            ]);

            setUser(me);
            setFriendsCount(relations.friends.length);
            setPendingCount(relations.invitations.length);
            setRecipes(myRecipes);
            setSavedRecipes(saved);

            if (me.avatar) {
                getSignedAvatarUrl(me.avatar).then(setAvatarUrl).catch(() => {});
            }
        } catch (error) {
            console.error("Erreur chargement profil :", error);
        } finally {
            setRefreshing(false);
        }
    }, []);

    const initialLoad = useRef(true);
    useFocusEffect(useCallback(() => {
        if (initialLoad.current) { initialLoad.current = false; return; }
        loadProfile();
    }, [loadProfile]));

    useEffect(() => { loadProfile() }, [loadProfile]);
    const onRefresh = useCallback(() => { setRefreshing(true); loadProfile(); }, [loadProfile]);

    const filteredRecipes = sortByMatch(recipes, search, r => r.name);
    const filteredSaved = sortByMatch(savedRecipes, search, s => s.recipe.name);

    const handleLongPress = (recipeID: number) => {
        setSelectedIDs(prev => new Set([...prev, recipeID]));
    };

    const handleCardPress = (recipeID: number) => {
        if (isSelecting) {
            setSelectedIDs(prev => {
                const next = new Set(prev);
                next.has(recipeID) ? next.delete(recipeID) : next.add(recipeID);
                return next;
            });
        } else {
            router.push({ pathname: '/recipe/[recipeID]', params: { recipeID: recipeID.toString() } });
        }
    };

    const handleDeleteSelected = async () => {
        const toDelete = [...selectedIDs];
        const previous = recipes;
        setRecipes(prev => prev.filter(r => !selectedIDs.has(r.recipeID)));
        setSelectedIDs(new Set());
        try {
            await Promise.all(toDelete.map(id => deleteRecipe(id)));
        } catch {
            setRecipes(previous);
            setSelectedIDs(new Set(toDelete));
            Alert.alert('Erreur', 'Impossible de supprimer les recettes sélectionnées.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primaryLight} />}
            >
                <TouchableOpacity
                    style={styles.settings}
                    onPress={isSelecting ? () => setSelectedIDs(new Set()) : () => router.push("/settings")}
                >
                    {isSelecting
                        ? <Text style={styles.cancelText}>Annuler</Text>
                        : <Settings size={26} color={Colors.textPrimary} />
                    }
                </TouchableOpacity>

                <ProfileDescription
                    avatarUrl={avatarUrl ?? "https://api.dicebear.com/7.x/adventurer/png?seed=default"}
                    username={user?.pseudo ?? "Chargement..."}
                    bio={user ? `${user.firstName} ${user.lastName}` : ""}
                    recipesCount={recipes.length}
                    friendsCount={friendsCount}
                    pendingCount={pendingCount}
                    onPressFriends={() => router.push("/friends")}
                    onPressInvitations={() => router.push("/invitations")}
                />

                <Text style={styles.sectionTitle}>Mes recettes</Text>

                <SearchBar
                    placeholder="Rechercher une recette..."
                    value={search}
                    onChangeText={setSearch}
                    showFilter
                    onFilterPress={() => {}}
                    filterButtonColor={Colors.surface}
                />

                <Grid>
                    {(cardWidth) =>
                        filteredRecipes.map((recipe) => (
                            <RecipeCard
                                key={recipe.recipeID}
                                recipe={recipe}
                                cardWidth={cardWidth}
                                isSelecting={isSelecting}
                                selected={selectedIDs.has(recipe.recipeID)}
                                onPress={() => handleCardPress(recipe.recipeID)}
                                onLongPress={() => handleLongPress(recipe.recipeID)}
                            />
                        ))
                    }
                </Grid>

                {filteredSaved.length > 0 && (
                    <>
                        <View style={styles.divider} />
                        <Text style={styles.sectionTitle}>Recettes sauvegardées</Text>

                        <Grid>
                            {(cardWidth) =>
                                filteredSaved.map((s) => (
                                    <RecipeCard
                                        key={s.recipeID}
                                        recipe={s.recipe}
                                        cardWidth={cardWidth}
                                        creator={s.recipe.creator}
                                    />
                                ))
                            }
                        </Grid>
                    </>
                )}
            </ScrollView>

            {isSelecting && (
                <View style={styles.deleteBar}>
                    <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteSelected}>
                        <Trash2 size={18} color={Colors.surface} />
                        <Text style={styles.deleteBtnText}>
                            Supprimer ({selectedIDs.size})
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelBtn} onPress={() => setSelectedIDs(new Set())}>
                        <Text style={styles.cancelBtnText}>Annuler</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    settings: {
        position: "absolute",
        top: 8,
        right: 24,
        zIndex: 10,
    },
    cancelText: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.medium,
        color: Colors.primary,
    },
    deleteBar: {
        flexDirection: 'row',
        gap: Spacing.sm,
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.md,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        backgroundColor: Colors.background,
    },
    deleteBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        backgroundColor: Colors.error,
        borderRadius: BorderRadius.md,
        paddingVertical: Spacing.md,
    },
    deleteBtnText: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.bold,
        color: Colors.surface,
    },
    cancelBtn: {
        paddingHorizontal: Spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelBtnText: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.medium,
        color: Colors.textSecondary,
    },
    sectionTitle: {
        fontSize: FontSize.xxxl,
        fontWeight: FontWeight.bold,
        color: Colors.textPrimary,
        paddingHorizontal: 24,
        marginBottom: 14,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginHorizontal: 24,
        marginBottom: 20,
    },
});
