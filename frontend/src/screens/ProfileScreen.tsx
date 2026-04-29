// src/screens/ProfileScreen.tsx
import { useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { Colors } from "../constants";

export default function ProfileScreen() {
  const [search, setSearch] = useState("");

  return (
    <View style={styles.container}>
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
            <Text style={styles.bio}>Cuisiner, partager, se régaler 👨‍🍳</Text>
          </View>

          <Text style={styles.settings}>⚙️</Text>
        </View>

        <View style={styles.statsRow}>
          <StatCard icon="👨‍🍳" value="28" label="recettes" />
          <StatCard icon="👥" value="109" label="amis" />
          <StatCard icon="✉️" value="" label="en attente" badge="3" />
        </View>

        <Text style={styles.sectionTitle}>Mes recettes</Text>



        <View style={styles.grid}>
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} {...recipe} />
          ))}
        </View>
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

const recipes = [
  {
    id: 1,
    title: "Tarte aux pommes",
    time: "1h30min",
    tag: "Tarte",
    color: "#FBE9DC",
    image: "https://images.unsplash.com/photo-1621743478914-cc8a86d7e7b5?w=400",
  },
  {
    id: 2,
    title: "Brownie",
    time: "45min",
    tag: "Goûter",
    color: "#FDF0E6",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400",
  },
  {
    id: 3,
    title: "Cheesecake",
    time: "2h15min",
    tag: "Dessert",
    color: "#FDEAF2",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400",
  },
  {
    id: 4,
    title: "Baguette",
    time: "1h30min",
    tag: "Pain",
    color: "#EFF8EA",
    icon: "🥖",
  },
  {
    id: 5,
    title: "Cookies",
    time: "30min",
    tag: "Goûter",
    color: "#EAF6FC",
    icon: "🍪",
  },
  {
    id: 6,
    title: "Pain au lait",
    time: "2h",
    tag: "Petit déjeuner",
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
  icon: string;
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
      <Text style={styles.statIcon}>{icon}</Text>
      {value !== "" && <Text style={styles.statValue}>{value}</Text>}
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function RecipeCard({
  title,
  time,
  tag,
  color,
  image,
  icon,
}: {
  title: string;
  time: string;
  tag: string;
  color: string;
  image?: string;
  icon?: string;
}) {
  return (
    <View style={[styles.recipeCard, { backgroundColor: color }]}>
      {image ? (
        <Image source={{ uri: image }} style={styles.recipeImage} />
      ) : (
        <View style={styles.recipeIconCircle}>
          <Text style={styles.recipeIcon}>{icon}</Text>
        </View>
      )}

      <View style={styles.recipeContent}>
        <Text style={styles.recipeTitle}>{title}</Text>
        <Text style={styles.recipeTime}>🕒 {time}</Text>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{tag}</Text>
        </View>
      </View>
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
      <Text style={[styles.navIcon, active && styles.activeText]}>{icon}</Text>
      <Text style={[styles.navLabel, active && styles.activeText]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 45,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 28,
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
    color: Colors.textPrimary,
  },

  bio: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginTop: 6,
  },

  settings: {
    fontSize: 32,
    color: Colors.textPrimary,
  },

  statsRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 24,
    marginBottom: 30,
  },

  statCard: {
    flex: 1,
    height: 100,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  statIcon: {
    fontSize: 28,
  },

  statValue: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.textPrimary,
  },

  statLabel: {
    fontSize: 14,
    color: Colors.textPrimary,
  },

  badge: {
    position: "absolute",
    top: -10,
    right: -6,
    backgroundColor: Colors.error,
    width: 32,
    height: 32,
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
    color: Colors.textPrimary,
    paddingHorizontal: 24,
    marginBottom: 14,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    paddingHorizontal: 24,
    paddingBottom: 120,
  },

  recipeCard: {
    width: "48%",
    height: 165,
    borderRadius: 22,
    overflow: "hidden",
    flexDirection: "row",
  },

  recipeImage: {
    width: "50%",
    height: "100%",
  },

  recipeIconCircle: {
    width: "48%",
    alignItems: "center",
    justifyContent: "center",
  },

  recipeIcon: {
    fontSize: 52,
  },

  recipeContent: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },

  recipeTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 10,
  },

  recipeTime: {
    fontSize: 13,
    color: Colors.textPrimary,
    marginBottom: 10,
  },

  tag: {
    alignSelf: "flex-start",
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },

  tagText: {
    color: "white",
    fontSize: 12,
    fontWeight: "700",
  },

  navbar: {
    position: "absolute",
    bottom: 20,
    left: 24,
    right: 24,
    height: 92,
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
    color: Colors.textPrimary,
  },

  navLabel: {
    fontSize: 13,
    marginTop: 4,
    color: Colors.textPrimary,
  },

  activeText: {
  },
});