// src/screens/ProfileScreen.tsx
import { useEffect, useState } from "react";
import { Text, StyleSheet, ScrollView, Pressable } from "react-native";
import SearchBar from "../components/ui/SearchBar";
import RecipeCard from "../components/ui/Recipe/RecipeCard";
import { Colors } from "../constants/colors";
import { FontSize, FontWeight } from "../constants/typography";
import { Settings } from "lucide-react-native";
import type { Recipe } from "../types/recipe";
import Grid from "../components/ui/Recipe/RecipeGrid";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileDescription from "../components/ui/Profile/ProfileDescription";
import { router } from "expo-router";
import {
  getSignedAvatarUrl,
  getSignedRecipePhotoUrl,
} from "../services/storage.service";
import { getMe, type User } from "../services/users.service";
import { getMyRecipes } from "../services/recipes.service";

type RecipeWithStyle = Recipe & {
  color?: string;
  icon?: string;
};

export default function ProfileScreen() {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<RecipeWithStyle[]>([]);

  useEffect(() => {
    async function loadProfile() {
      try {
        const me = await getMe();
        setUser(me);

        if (me.avatar) {
          const signedAvatarUrl = await getSignedAvatarUrl(me.avatar);
          setAvatarUrl(signedAvatarUrl);
        } else {
          setAvatarUrl(null);
        }

        const myRecipes = await getMyRecipes();

        const recipesWithSignedPhotos: RecipeWithStyle[] = await Promise.all(
          myRecipes.map(async (recipe) => {
            if (!recipe.photo) {
              return {
                ...recipe,
                color: "#FBE9DC",
              };
            }

            if (recipe.photo.startsWith("http")) {
              return {
                ...recipe,
                color: "#FBE9DC",
              };
            }

            const signedPhotoUrl = await getSignedRecipePhotoUrl(recipe.photo);

            return {
              ...recipe,
              photo: signedPhotoUrl,
              color: "#FBE9DC",
            };
          }),
        );

        setRecipes(recipesWithSignedPhotos);
      } catch (error) {
        console.error("Erreur lors du chargement du profil :", error);
      }
    }

    loadProfile();
  }, []);

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Pressable
          style={styles.settings}
          onPress={() => router.push("/register")}
        >
          <Settings size={26} color={Colors.textPrimary} />
        </Pressable>

        <ProfileDescription
          avatarUrl={
            avatarUrl ??
            "https://api.dicebear.com/7.x/adventurer/png?seed=default"
          }
          username={user?.pseudo ?? "Chargement..."}
          bio={
            user
              ? `${user.firstName} ${user.lastName}`
              : "Chargement du profil..."
          }
          recipesCount={recipes.length}
          friendsCount={109}
          pendingCount={3}
        />

        <Text style={styles.sectionTitle}>Mes recettes</Text>

        <SearchBar
          placeholder="Rechercher une recette..."
          value={search}
          onChangeText={setSearch}
          showFilter
          onFilterPress={() => console.log("Filtre pressé")}
          filterButtonColor={Colors.surface}
        />

        <Grid>
          {(cardWidth) =>
            filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.recipeID}
                recipe={recipe}
                color={recipe.color}
                icon={recipe.icon}
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