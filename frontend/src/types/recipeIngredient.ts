import { Float } from "react-native/Libraries/Types/CodegenTypes";
import { Ingredient } from "./ingredient";

export type RecipeIngredient = {
    recipeId: number;
    unitId:number;
    quantity: Float;
    ingredient: Ingredient;
};