// src/screens/RecipeScreen.tsx
import { useState, useEffect } from "react";
import { StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/src/constants/colors";
import RecipeHeader from "@/src/components/ui/Recipe/RecipeHeader";
import RecipeTabBar, { RecipeTab } from "@/src/components/ui/Recipe/RecipeTabBar";
import IngredientsList from "@/src/components/ui/Recipe/IngredientsList";
import PreparationList from "@/src/components/ui/Recipe/PreparationList";
import EditHeaderSheet from "@/src/components/ui/Recipe/EditHeaderSheet";
import { getRecipeById, updateRecipe } from "@/src/services/recipes.service";
import type { Recipe } from "@/src/types/recipe";
import { useRouter } from "expo-router";

type RecipeScreenProps = {
  recipeID: number;
  onBack?: () => void;
  onShare?: () => void;
};

const formatTime = (minutes: number): string =>
  minutes >= 60
    ? `${Math.floor(minutes / 60)}h${minutes % 60 > 0 ? `${minutes % 60}min` : ""}`
    : `${minutes}min`;

export default function RecipeScreen({ recipeID, onBack, onShare }: RecipeScreenProps) {
  const router = useRouter();
  const [tab, setTab] = useState<RecipeTab>("ingredients");
  const [portions, setPortions] = useState<number>(1);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [headerSheetVisible, setHeaderSheetVisible] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getRecipeById(recipeID);
        setRecipe(data);
        setPortions(data.portion);
      } catch (e) {
        console.error("Erreur chargement recette", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [recipeID]);

  const handleSaveHeader = async (data: { title: string; prepTime: number; cookTime: number }) => {
    if (!recipe) return;
    const updated = { ...recipe, name: data.title, prepTime: data.prepTime, cookTime: data.cookTime };
    setRecipe(updated);
    try {
      await updateRecipe(recipeID, { name: data.title, prepTime: data.prepTime, cookTime: data.cookTime });
    } catch (e) {
      console.error("Erreur mise à jour header", e);
      setRecipe(recipe);
    }
  };

  const handleAddIngredient = async (data: { name: string; quantity: number; unit: string }) => {
    if (!recipe) return;
    const newIngredient = {
      ingredient: { name: data.name },
      quantity: data.quantity,
      unit: { type: data.unit },
    } as any;
    const updated = { ...recipe, ingredients: [...recipe.ingredients, newIngredient] };
    setRecipe(updated);
    try {
      await updateRecipe(recipeID, { ingredients: updated.ingredients });
    } catch (e) {
      console.error("Erreur ajout ingrédient", e);
      setRecipe(recipe);
    }
  };

  const handleEditIngredient = async (index: number, data: { name: string; quantity: number; unit: string }) => {
    if (!recipe) return;
    const updatedIngredients = recipe.ingredients.map((ing, i) =>
      i === index
        ? { ...ing, ingredient: { ...ing.ingredient, name: data.name }, quantity: data.quantity, unit: { type: data.unit } }
        : ing
    );
    const updated = { ...recipe, ingredients: updatedIngredients };
    setRecipe(updated);
    try {
      await updateRecipe(recipeID, { ingredients: updatedIngredients });
    } catch (e) {
      console.error("Erreur modification ingrédient", e);
      setRecipe(recipe);
    }
  };

  const handleDeleteIngredient = async (index: number) => {
    if (!recipe) return;
    const updatedIngredients = recipe.ingredients.filter((_, i) => i !== index);
    const updated = { ...recipe, ingredients: updatedIngredients };
    setRecipe(updated);
    try {
      await updateRecipe(recipeID, { ingredients: updatedIngredients });
    } catch (e) {
      console.error("Erreur suppression ingrédient", e);
      setRecipe(recipe);
    }
  };

  const handleSaveSteps = async (steps: string[]) => {
    if (!recipe) return;
    const updatedSteps = steps.map((text, i) => ({ ...(recipe.steps[i] ?? {}), text }));
    const updated = { ...recipe, steps: updatedSteps };
    setRecipe(updated);
    try {
      await updateRecipe(recipeID, { steps: updatedSteps });
    } catch (e) {
      console.error("Erreur mise à jour étapes", e);
      setRecipe(recipe);
    }
  };

  if (loading || !recipe) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator style={{ flex: 1 }} color={Colors.primaryLight} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <RecipeHeader
        title={recipe.name}
        description={recipe.description}
        prepTime={formatTime(recipe.prepTime)}
        totalTime={formatTime(recipe.prepTime + recipe.cookTime)}
        onBack={() => router.back()}
        onShare={onShare}
        isEditing={isEditing}
        onToggleEdit={() => setIsEditing((v) => !v)}
        onEdit={isEditing ? () => setHeaderSheetVisible(true) : undefined}
      />

      <RecipeTabBar activeTab={tab} onTabChange={setTab} />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {tab === "ingredients" ? (
          <IngredientsList
            ingredients={recipe.ingredients}
            basePortions={recipe.portion}
            portions={portions}
            categories={[]}
            onIncrement={() => setPortions((p) => p + 1)}
            onDecrement={() => setPortions((p) => Math.max(1, p - 1))}
            onAddIngredient={isEditing ? handleAddIngredient : undefined}
            onEditIngredient={isEditing ? handleEditIngredient : undefined}
            onDeleteIngredient={isEditing ? handleDeleteIngredient : undefined}
          />
        ) : (
          <PreparationList
            steps={recipe.steps.map((s) => s.text)}
            onSave={isEditing ? handleSaveSteps : undefined}
          />
        )}
      </ScrollView>

      <EditHeaderSheet
        visible={headerSheetVisible}
        title={recipe.name}
        prepTime={recipe.prepTime}
        cookTime={recipe.cookTime}
        onClose={() => setHeaderSheetVisible(false)}
        onSave={handleSaveHeader}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  content: {
    flex: 1,
    marginTop: 12,
    marginHorizontal: 20,
    backgroundColor: Colors.cardLight,
    borderRadius: 20,
  },
  contentContainer: { padding: 18, paddingBottom: 24 },
});
