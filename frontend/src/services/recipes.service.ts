import { apiFetch } from '@/src/config/api'
import { supabase } from '@/src/config/supabase';
import { CreateRecipeDTO, Recipe } from '../types/recipe'
import { Ingredient } from '../types/ingredient'
import { uploadRecipePhoto } from './storage.service';

export type RecipeCreator = {
  userID: string
  pseudo: string
  firstName: string
  lastName: string
  avatar?: string | null
}

export type RecipeDetail = Recipe & {
  creator?: RecipeCreator
  savedBy?: Array<{ userID: string }>
}

export type FeedRecipe = RecipeDetail & {
  creator: RecipeCreator
}

export type FeedResult = { recent: FeedRecipe[]; random: FeedRecipe[] }

export const getMyRecipes = async (): Promise<RecipeDetail[]> =>
  apiFetch('/recipes/me', { method: 'GET' })

export const getFeed = async (): Promise<FeedResult> =>
  apiFetch('/recipes/feed', { method: 'GET' })

export const getAllRecipes = async (): Promise<RecipeDetail[]> => {
  return await apiFetch('/recipes', { method: 'GET' });
};

export const getRecipeById = async (recipeID: number): Promise<RecipeDetail> => {
  return await apiFetch(`/recipes/${recipeID}`, { method: 'GET' });
};

export const createRecipe = async (form: CreateRecipeDTO): Promise<Recipe> => {
  const recipe = await apiFetch('/recipes', {
    method: 'POST',
    body: JSON.stringify({
      name: form.name,
      portion: form.portions,
      prepTime: form.prepTime,
      cookTime: form.cookTime,
      description: form.description,
      ingredients: form.recipeIngredients,
      steps: form.steps,
    }),
  });

  if (!form.photoUri) {
    return recipe;
  }

  const { data } = await supabase.auth.getSession();
  const userID = data.session?.user.id;

  if (!userID) {
    throw new Error('Utilisateur non connecté.');
  }

  const photoPath = await uploadRecipePhoto(
    form.photoUri,
    userID,
    recipe.recipeID,
  );

  return await updateRecipePhoto(recipe.recipeID, photoPath);
};

export const updateRecipePhoto = async (
  recipeID: number,
  photo: string,
): Promise<Recipe> => {
  return await apiFetch(`/recipes/${recipeID}/photo`, {
    method: 'PATCH',
    body: JSON.stringify({
      photo,
    }),
  });
};

export const deleteRecipe = async (recipeID: number): Promise<void> => {
  await apiFetch(`/recipes/${recipeID}`, { method: 'DELETE' })
}

export const updateRecipe = async (
  recipeID: number,
  data: Partial<{
    name: string;
    prepTime: number;
    cookTime: number;
    description: string;
    portion: number;
    ingredients: any[];
    steps: any[];
  }>
): Promise<Recipe> => {
  return await apiFetch(`/recipes/${recipeID}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};
