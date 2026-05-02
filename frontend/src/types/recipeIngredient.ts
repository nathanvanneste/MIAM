import { Ingredient } from "./ingredient";

export type RecipeIngredient = {
    ingredient: Ingredient
    unit: string;
    quantity: number;

};

export type CreateRecipeIngredientDTO = {
    ingredientID: number
    quantity: number
    unitID: number
}