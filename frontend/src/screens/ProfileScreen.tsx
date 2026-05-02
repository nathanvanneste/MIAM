// src/screens/ProfileScreen.tsx
import { useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, Pressable} from "react-native";
import SearchBar from "../components/ui/SearchBar";
import RecipeCard from "../components/ui/Recipe/RecipeCard";
import { Colors } from "../constants/colors";
import { FontSize, FontWeight } from "../constants/typography";
import { Settings, ChefHat, UsersRound, Mail } from "lucide-react-native";
import type { ReactNode } from "react";
import type { Recipe } from "../types/recipe";
import Grid from "../components/ui/Recipe/RecipeGrid";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileDescription from "../components/ui/Profile/ProfileDescription";

type RecipeWithStyle = Recipe & {
  color?: string;
  icon?: string;
};

export default function ProfileScreen() {
  const [search, setSearch] = useState("");

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView showsVerticalScrollIndicator={false}>

        <Pressable
        style={styles.settings}
        onPress={() => console.log("settings")}
      >
        <Settings size={26} color={Colors.textPrimary} />
      </Pressable>

        <ProfileDescription
          avatarUrl="https://api.dicebear.com/7.x/adventurer/png?seed=paul"
          username="paulcharp69"
          bio="Cuisiner, partager, se régaler 👨‍🍳"
          recipesCount={28}
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
            recipes.map((recipe) => (
              <RecipeCard
                key={recipe.recipeID}
                recipe={recipe}
                color={recipe.color}
                icon={recipe.icon}
                cardWidth={cardWidth} // ← Grid lui dit exactement quelle largeur prendre
              />
            ))
          }
        </Grid>

      </ScrollView>

    </SafeAreaView>
  );
}

const recipes: RecipeWithStyle[] = [
  {
    recipeID: 1,
    name: "Tarte aux pommes et aux noix",
    dateCreation: new Date(),
    prepTime: 30,
    cookTime: 60,
    photo:
      "https://images.unsplash.com/photo-1621743478914-cc8a86d7e7b5?w=400",
    portion: 6,
    description: "Une tarte aux pommes maison.",
    recipeIngredients: [],
    color: "#FBE9DC",
  },
  {
    recipeID: 2,
    name: "Brownie",
    dateCreation: new Date(),
    prepTime: 15,
    cookTime: 30,
    photo:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400",
    portion: 8,
    description: "Un brownie fondant.",
    recipeIngredients: [],
    color: "#FDF0E6",
  },
  {
    recipeID: 3,
    name: "Cheesecake",
    dateCreation: new Date(),
    prepTime: 25,
    cookTime: 110,
    photo:
      "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400",
    portion: 6,
    description: "Un cheesecake crémeux.",
    recipeIngredients: [],
    color: "#FDEAF2",
  },
  {
    recipeID: 4,
    name: "Baguette",
    dateCreation: new Date(),
    prepTime: 30,
    cookTime: 60,
    portion: 4,
    description: "Pain maison.",
    recipeIngredients: [],
    color: "#EFF8EA",
    icon: "🥖",
  },
  {
    recipeID: 5,
    name: "Cookies",
    dateCreation: new Date(),
    prepTime: 15,
    cookTime: 15,
    portion: 10,
    description: "Cookies maison.",
    recipeIngredients: [],
    color: "#EAF6FC",
    icon: "🍪",
  },
  {
    recipeID: 6,
    name: "Pain au lait",
    dateCreation: new Date(),
    prepTime: 40,
    cookTime: 80,
    portion: 6,
    description: "Pain au lait moelleux.",
    recipeIngredients: [],
    color: "#EAF8F0",
    icon: "🥛",
  },
];


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

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 12,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#E6D7FF",
  },

  headerText: {
    flex: 1,
    marginLeft: 18,
  },

  username: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },

  bio: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: 6,
  },

  statsRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 24,
    marginBottom: 15,
  },

  statCard: {
    flex: 1,
    height: 60,
    backgroundColor: Colors.cardLight,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 1,
  },

  statIcon: {
    marginTop: 5,
    marginBottom: 0,
  },

  statText: {
    flexDirection: "row",
  },

  statValue: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginTop: 0,
    marginBottom: 5,
  },

  statLabel: {
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },

  badge: {
    position: "absolute",
    top: -8,
    right: -4,
    backgroundColor: Colors.error,
    width: 27,
    height: 27,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  badgeText: {
    color: Colors.surface,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.lg,
  },

  sectionTitle: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    paddingHorizontal: 24,
    marginBottom: 14,
  },

  activeText: {
    color: Colors.primaryLight,
  },
});
