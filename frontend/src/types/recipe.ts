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
    recipeIngredients: RecipeIngredient[]

};

export type CreateRecipeDTO = {
    name: string
    portions: number
    prepTime: number
    cookTime: number
    recipeIngredients: RecipeIngredient[]
    categories: string[]
    description?: string
    photoUri?: string
}