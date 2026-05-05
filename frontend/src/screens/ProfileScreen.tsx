import { useEffect, useState, useCallback, useRef } from "react";
import { Text, StyleSheet, ScrollView, TouchableOpacity, View, RefreshControl } from "react-native";
import SearchBar from "../components/ui/SearchBar";
import RecipeCard from "../components/ui/Recipe/RecipeCard";
import { Colors } from "../constants/colors";
import { FontSize, FontWeight } from "../constants/typography";
import { Settings } from "lucide-react-native";
import type { Recipe } from "../types/recipe";
import Grid from "../components/ui/Recipe/RecipeGrid";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileDescription from "../components/ui/Profile/ProfileDescription";
import { router, useFocusEffect } from "expo-router";
import { getSignedAvatarUrl } from "../services/storage.service";
import { getMe, getMySavedRecipes, type User, type SavedRecipeItem } from "../services/users.service";
import { getMyRecipes } from "../services/recipes.service";
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

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primaryLight} />}
            >
                <TouchableOpacity
                    style={styles.settings}
                    onPress={() => router.push("/settings")}
                >
                    <Settings size={26} color={Colors.textPrimary} />
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
