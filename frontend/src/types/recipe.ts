import { RecipeIngredient } from "./recipeIngredient";

export type Recipe = {
    recipeID: number;
    name: string;
    dateCreation: Date;
    prepTime: number;
    cookTime: number;
    photo?: string;
    portion: number;
    description: string;
    recipeIngredients: RecipeIngredient[];

};