import { API_URL } from "../config/api";
import type { Recipe } from "../types/recipe";

export async function getRecipeById(id: number): Promise<Recipe> {
    const response = await fetch(`${API_URL}/recipes/${id}`);

    if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
    }

    return await response.json();
}

/*export async function getRecipeById(id: number): Promise<Recipe> {
    return {
        recipeID: 1,
        name: "gratin de pates",
        dateCreation: new Date(28, 3, 2026),
        nutScore: "A",
        prepTime: 13,
        cookTime: 11,
        portion: 12,
    };
}*/