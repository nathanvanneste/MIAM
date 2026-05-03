import { Ingredient } from "./ingredient";

export type RecipeIngredient = {
    ingredient: Ingredient
    unit: {          // ← était string, c'est un objet
        unitID: number;
        type: string;
    };
    quantity: number;
};

export type CreateRecipeIngredientDTO = {
    ingredientID: number
    quantity: number
    unitID: number
}