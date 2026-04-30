// src/screens/ProfileScreen.tsx
import { useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, Pressable} from "react-native";
import SearchBar from "../components/ui/SearchBar";
import RecipeCard from "../components/ui/Recipe/RecipeCard";
import { COLORS } from "../constants";
import { Settings, ChefHat, UsersRound, Mail } from "lucide-react-native";
import type { ReactNode } from "react";
import type { Recipe } from "../types/recipe";
import Grid from "../components/ui/Recipe/Grid";

type RecipeWithStyle = Recipe & {
  color?: string;
  icon?: string;
};

export default function ProfileScreen() {
  const [search, setSearch] = useState("");

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.settings}
        onPress={() => console.log("settings")}
      >
        <Settings size={26} color={COLORS.textPrimary} />
      </Pressable>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image
            source={{
              uri: "https://api.dicebear.com/7.x/adventurer/png?seed=paul",
            }}
            style={styles.avatar}
          />

          <View style={styles.headerText}>
            <Text style={styles.username}>@paulcharp69</Text>
            <Text style={styles.bio}>
              Cuisiner, partager, se régaler 👨‍🍳
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <StatCard icon={<ChefHat size={26} color={COLORS.textPrimary}/>} value="28" label="recettes" />
          <StatCard icon={<UsersRound size={26} color={COLORS.textPrimary}/>} value="109" label="amis" />
          <StatCard icon={<Mail size={26} color={COLORS.textPrimary}/>} value="" label="en attente" badge="3" />
        </View>

        <Text style={styles.sectionTitle}>Mes recettes</Text>

        <SearchBar
          placeholder="Rechercher une recette..."
          value={search}
          onChangeText={setSearch}
          showFilter
          onFilterPress={() => console.log("Filtre pressé")}
          filterButtonColor={COLORS.secondaryBackground}
        />

        <Grid>
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.recipeID}
              recipe={recipe}
              color={recipe.color}
              icon={recipe.icon}
            />
          ))}
        </Grid>

      </ScrollView>

      <View style={styles.navbar}>
        <NavItem icon="＋" label="Créer" />
        <NavItem icon="👥" label="Groupes" />
        <NavItem icon="👤" label="Profil" active />
        <NavItem icon="🧭" label="Découvrir" />
        <NavItem icon="🛒" label="Courses" />
      </View>
    </View>
  );
}

const recipes: RecipeWithStyle[] = [
  {
    recipeID: 1,
    name: "Tarte aux pommes",
    dateCreation: new Date(),
    prepTime: 30,
    cookTime: 60,
    photo:
      "https://images.unsplash.com/photo-1621743478914-cc8a86d7e7b5?w=400",
    portion: 6,
    description: "Une tarte aux pommes maison.",
    ingredients: [],
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
    ingredients: [],
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
    ingredients: [],
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
    ingredients: [],
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
    ingredients: [],
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
    ingredients: [],
    color: "#EAF8F0",
    icon: "🥛",
  },
];

function StatCard({
  icon,
  value,
  label,
  badge,
}: {
  icon: ReactNode;
  value: string;
  label: string;
  badge?: string;
}) {
  return (
    <View style={styles.statCard}>
      {badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}

      <View style={styles.statIcon}>{icon}</View>

      <Text style={styles.statText}>
        {value !== "" && <Text style={styles.statValue}>{value} </Text>}
        <Text style={styles.statLabel}>{label}</Text>
      </Text>
    </View>
  );
}

function NavItem({
  icon,
  label,
  active,
}: {
  icon: string;
  label: string;
  active?: boolean;
}) {
  return (
    <View style={styles.navItem}>
      <Text style={[styles.navIcon, active && styles.activeText]}>
        {icon}
      </Text>
      <Text style={[styles.navLabel, active && styles.activeText]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 45,
  },

  settings: {
    position: "absolute",
    top: 50,
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
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },

  bio: {
    fontSize: 15,
    color: COLORS.textSecondary,
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
    backgroundColor: COLORS.secondaryBackground,
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
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: 0, 
    marginBottom: 5,
  },

  statLabel: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },

  badge: {
    position: "absolute",
    top: -8,
    right: -4,
    backgroundColor: COLORS.error,
    width: 27,
    height: 27,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  badgeText: {
    color: "white",
    fontWeight: "800",
    fontSize: 16,
  },

  sectionTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.textPrimary,
    paddingHorizontal: 24,
    marginBottom: 14,
  },

  navbar: {
    position: "absolute",
    bottom: 20,
    left: 24,
    right: 24,
    height: 92,
    backgroundColor: COLORS.card,
    borderRadius: 28,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  navItem: {
    alignItems: "center",
  },

  navIcon: {
    fontSize: 28,
    color: COLORS.card,
  },

  navLabel: {
    fontSize: 13,
    marginTop: 4,
    color: COLORS.textPrimary,
  },

  activeText: {
    color: COLORS.primaryDark,
  },
});