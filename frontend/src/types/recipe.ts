import { CreateRecipeIngredientDTO, RecipeIngredient } from "./recipeIngredient";
import { CreateStepDTO } from './step'


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
    steps: CreateStepDTO[]
    recipeIngredients: CreateRecipeIngredientDTO[]
    categories: string[]
    description?: string
    photoUri?: string
}