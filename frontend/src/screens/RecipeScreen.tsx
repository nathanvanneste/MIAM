// src/screens/RecipeScreen.tsx
import { useState, useEffect, useRef } from "react";
import { StyleSheet, ScrollView, ActivityIndicator, Alert, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/src/constants/colors";
import RecipeHeader from "@/src/components/ui/Recipe/RecipeHeader";
import RecipeTabBar, { RecipeTab } from "@/src/components/ui/Recipe/RecipeTabBar";
import IngredientsList from "@/src/components/ui/Recipe/IngredientsList";
import PreparationList from "@/src/components/ui/Recipe/PreparationList";
import EditHeaderSheet from "@/src/components/ui/Recipe/EditHeaderSheet";
import PrimaryButton from "@/src/components/ui/PrimaryButton";
import { getRecipeById, updateRecipe } from "@/src/services/recipes.service";
import type { RecipeDetail } from "@/src/services/recipes.service";
import type { RecipeIngredient } from "@/src/types/recipeIngredient";
import type { IngredientFormData } from "@/src/components/ui/Recipe/IngredientFormSheet";
import { useRouter } from "expo-router";

type RecipeScreenProps = {
  recipeID: number;
  onShare?: () => void;
};

const formatTime = (minutes: number): string =>
  minutes >= 60
    ? `${Math.floor(minutes / 60)}h${minutes % 60 > 0 ? `${minutes % 60}min` : ""}`
    : `${minutes}min`;

const toBackendIngredients = (ingredients: RecipeIngredient[]) =>
  ingredients.map((ing) => ({
    ingredientID: ing.ingredientID,
    quantity: ing.quantity,
    unitID: ing.unitID,
  }));

export default function RecipeScreen({ recipeID, onShare }: RecipeScreenProps) {
  const router = useRouter();
  const [tab, setTab] = useState<RecipeTab>("ingredients");
  const [portions, setPortions] = useState<number>(1);
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [headerSheetVisible, setHeaderSheetVisible] = useState(false);

  // Track unsaved changes
  const hasUnsavedChanges = useRef(false);

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

  // Mark changes as unsaved whenever recipe state changes in edit mode
  const markUnsaved = () => { hasUnsavedChanges.current = true; };

  const handleToggleEdit = () => {
    if (isEditing && hasUnsavedChanges.current) {
      Alert.alert(
        "Modifications non enregistrées",
        "Vous avez des modifications non enregistrées. Voulez-vous les annuler ?",
        [
          { text: "Continuer l'édition", style: "cancel" },
          {
            text: "Annuler les modifications",
            style: "destructive",
            onPress: () => {
              hasUnsavedChanges.current = false;
              setIsEditing(false);
            },
          },
        ]
      );
    } else {
      hasUnsavedChanges.current = false;
      setIsEditing((v) => !v);
    }
  };

  const handleSaveAll = async () => {
    if (!recipe) return;
    setIsSaving(true);
    try {
      await updateRecipe(recipeID, {
        name: recipe.name,
        description: recipe.description ?? undefined,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        ingredients: toBackendIngredients(recipe.ingredients),
        steps: recipe.steps.map((s, i) => ({
          ...(s.stepID ? { stepID: s.stepID } : {}), // ← stepID seulement si existant
          text: s.text,
          order: i + 1,
        })),
      });
            hasUnsavedChanges.current = false;
      setIsEditing(false);
    } catch (e) {
      Alert.alert("Erreur", "Impossible d'enregistrer les modifications.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveHeader = (data: { title: string; description: string; prepTime: number; cookTime: number }) => {
    if (!recipe) return;
    setRecipe({ ...recipe, name: data.title, description: data.description, prepTime: data.prepTime, cookTime: data.cookTime });
    markUnsaved();
  };

  const handleAddIngredient = (data: IngredientFormData) => {
    if (!recipe) return;
    const newIngredient: RecipeIngredient = {
      ingredientID: data.ingredientID,
      unitID: data.unitID,
      quantity: data.quantity,
      ingredient: { ingredientID: data.ingredientID, name: data.name, category: '', calories: 0, unitDefault: data.unit },
      unit: { unitID: data.unitID, type: data.unit },
    };
    setRecipe({ ...recipe, ingredients: [...recipe.ingredients, newIngredient] });
    markUnsaved();
  };

  const handleEditIngredient = (index: number, data: IngredientFormData) => {
    if (!recipe) return;
    const updatedIngredients = recipe.ingredients.map((ing, i) =>
      i === index
        ? {
            ...ing,
            ingredientID: data.ingredientID,
            quantity: data.quantity,
            unitID: data.unitID,
            ingredient: { ...ing.ingredient, ingredientID: data.ingredientID, name: data.name },
            unit: { unitID: data.unitID, type: data.unit },
          }
        : ing
    );
    setRecipe({ ...recipe, ingredients: updatedIngredients });
    markUnsaved();
  };

  const handleDeleteIngredient = (index: number) => {
    if (!recipe) return;
    setRecipe({ ...recipe, ingredients: recipe.ingredients.filter((_, i) => i !== index) });
    markUnsaved();
  };

  const handleSaveSteps = (steps: string[]) => {
    if (!recipe) return;
    const updatedSteps = steps.map((text, i) => ({
      ...(recipe.steps[i] ?? {}),
      text,
      order: i + 1,                    // ← toujours présent
      recipeID: recipe.recipeID,       // ← toujours présent
      // stepID absent pour les nouvelles étapes — le backend le génère
    }));
    setRecipe({ ...recipe, steps: updatedSteps });
    markUnsaved();
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
        cookTime={formatTime(recipe.cookTime)}
        onBack={() => router.back()}
        onShare={onShare}
        isEditing={isEditing}
        onToggleEdit={handleToggleEdit}
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

      {/* Save button — only visible in edit mode */}
      {isEditing && (
        <View style={styles.footer}>
          <PrimaryButton
            title={isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
            onPress={handleSaveAll}
            backgroundColor={Colors.primaryButton}
            textColor={Colors.surface}
          />
        </View>
      )}

      <EditHeaderSheet
        visible={headerSheetVisible}
        title={recipe.name}
        description={recipe.description ?? null}
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
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: Colors.background,
  },
});
