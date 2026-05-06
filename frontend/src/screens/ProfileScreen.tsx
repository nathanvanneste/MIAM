import { useEffect, useState, useCallback } from "react";
import { Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useFocusEffect , router } from "expo-router";
import SearchBar from "../components/ui/SearchBar";
import RecipeCard from "../components/ui/Recipe/RecipeCard";
import { Colors } from "../constants/colors";
import { FontSize, FontWeight } from "../constants/typography";
import { Settings } from "lucide-react-native";
import type { Recipe } from "../types/recipe";
import Grid from "../components/ui/Recipe/RecipeGrid";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileDescription from "../components/ui/Profile/ProfileDescription";
import { getSignedAvatarUrl } from "../services/storage.service";
import { getMe, type User } from "../services/users.service";
import { getMyRecipes } from "../services/recipes.service";
import { getMyRelations } from "../services/friends.service";

export default function ProfileScreen() {
    const [search, setSearch] = useState("");
    const [user, setUser] = useState<User | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [friendsCount, setFriendsCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);

    const loadProfile = useCallback(async () => {
        try {
            const [me, myRecipes, relations] = await Promise.all([
                getMe(),
                getMyRecipes(),
                getMyRelations().catch(() => ({ friends: [], invitations: [], sentPending: [], myID: '' })),
            ]);

            setUser(me);
            setFriendsCount(relations.friends.length);
            setPendingCount(relations.invitations.length);
            setRecipes(myRecipes);

            if (me.avatar) {
                getSignedAvatarUrl(me.avatar).then(setAvatarUrl).catch(() => {});
            }
        } catch (error) {
             
            console.error("Erreur chargement profil :", error instanceof Error ? error.message : String(error));
        }
    }, []);

    // Reload profile every time we focus on this screen
    useFocusEffect(
        useCallback(() => {
            loadProfile();
        }, [loadProfile])
    );

    // Also run on initial mount as backup
    useEffect(() => { loadProfile() }, [loadProfile]);

    const filteredRecipes = recipes.filter((r) =>
        r.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
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
});
