import { Ingredient } from "./ingredient";

export type RecipeIngredient = {
    unit: string;
    quantity: number;
    ingredient: Ingredient;
};