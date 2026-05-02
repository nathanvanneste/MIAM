import { View, ScrollView, StyleSheet } from "react-native";
import GroupCard from "../components/ui/Group/GroupCard";
import PrimaryButton from "../components/ui/PrimaryButton";
import OutlineButton from "../components/ui/OutlineButton";
import { Colors } from "../constants";
import GroupList from "../components/ui/Group/GroupList";
import SelectableIngredient from "../components/ui/Ingredient/SelectableIngredient";
import { useState } from "react";


export default function TestUIScreen() {
  const [checked, setChecked] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      {/* 🔹 GroupCard */}
      <GroupCard
        image="https://api.dicebear.com/7.x/adventurer/png?seed=group"
        title="Pique Nique Tête d’Or"
        membersCount={5}
        recipesCount={3}
        onPress={() => console.log("Group pressed")}
      />

      {/* 🔹 Autre exemple */}
      <GroupCard
        image="https://api.dicebear.com/7.x/adventurer/png?seed=friends"
        title="Soirée entre amis"
        membersCount={8}
        recipesCount={6}
      />

      {/* 🔹 Primary Buttons */}
      <PrimaryButton
        title="Se connecter"
        onPress={() => {}}
        backgroundColor="#F4A23A"
      />

      <PrimaryButton
        title="Valider"
        onPress={() => {}}
        backgroundColor="#4CAF50"
      />

      {/* 🔹 Outline Buttons */}
      <OutlineButton
        title="Ajouter un ingrédient"
        onPress={() => {}}
        color="#7FA36C"
      />

      <OutlineButton
        title="Créer un groupe"
        onPress={() => {}}
        color="#FF6B6B"
        backgroundColor="#FFECEC"
      />

        
    <GroupList groups={groups} />

        <SelectableIngredient
            title="Baguette"
            checked={checked}
            quantity={quantity}
            color="#7FA6A4"
            buttonBackgroundColor="#eafffe"
            onToggle={() => setChecked(!checked)}
            onIncrement={() => setQuantity(quantity + 1)}
            onDecrement={() => setQuantity(Math.max(1, quantity - 1))}
        />
        
    </ScrollView>
  );
}

const groups = [
  {
    id: 1,
    image: "https://api.dicebear.com/7.x/adventurer/png?seed=1",
    title: "Pique Nique Tête d’Or",
    membersCount: 5,
    recipesCount: 3,
  },
  {
    id: 2,
    image: "https://api.dicebear.com/7.x/adventurer/png?seed=2",
    title: "Vacances Ski",
    membersCount: 3,
    recipesCount: 20,
  },
  {
    id: 3,
    image: "https://api.dicebear.com/7.x/adventurer/png?seed=3",
    title: "Anniv Ash",
    membersCount: 5,
    recipesCount: 8,
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    padding: 24,
    gap: 20,
  },
});

