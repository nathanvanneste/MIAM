import { CreateRecipeIngredientDTO, RecipeIngredient } from "./recipeIngredient";
import { CreateStepDTO, Step } from './step'


export type Recipe = {
    recipeID: number;
    name: string;
    createdAt: string;
    prepTime: number;
    cookTime: number;
    photo?: string | null;
    portion: number;
    description?: string | null;
    ingredients: RecipeIngredient[];
    steps: Step[];

};

export type CreateRecipeDTO = {
    name: string
    portions: number
    prepTime: number
    cookTime: number
    steps: CreateStepDTO[]
    recipeIngredients: CreateRecipeIngredientDTO[]
    tagIDs?: number[]
    description?: string
    photoUri?: string
}