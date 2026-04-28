import { useEffect, useState } from "react";
import { Recipe } from "../types/recipe";
import { getRecipeById } from "../services/recipes.service";
import { View, Text } from "react-native";

export default function RecipeScreen() {
    const [recipe, setRecipe] = useState<Recipe | null>(null);

    useEffect(() => {
        getRecipeById(1)
            .then(setRecipe)
            .catch(console.error);
    }, []);

    if (!recipe) {
        return <Text>Chargement...</Text>;
    }

    return (
        <View>
            <Text>{recipe.name}</Text>
            <Text>{recipe.description}</Text>
        </View>
    );
}

