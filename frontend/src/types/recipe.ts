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
<<<<<<< HEAD
    price?: number | null;
    nutritionalScore?: number | null;
    creatorID: string;
    recipeIngredients: RecipeIngredient[];
=======
    ingredients: RecipeIngredient[];
    steps: Step[];

>>>>>>> origin/elodie_recipeScreen
};

export type CreateRecipeDTO = {
    name: string
    portions: number
    prepTime: number
    cookTime: number
    steps: CreateStepDTO[]
    recipeIngredients: CreateRecipeIngredientDTO[]
    categories: string[]
    description?: string
    photoUri?: string
}