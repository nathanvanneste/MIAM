import { apiFetch } from '@/src/config/api'
import { supabase } from '@/src/config/supabase';
import { CreateRecipeDTO, Recipe } from '../types/recipe'
import { uploadRecipePhoto } from './storage.service';

// RecipeDetail = Recipe (backend returns the same shape for all recipe endpoints)
export type RecipeDetail = Recipe

export type FeedRecipe = RecipeDetail & {
  creator: {
    userID: string
    pseudo: string
    firstName: string
    lastName: string
    avatar?: string | null
  }
}

export type FeedResult = { recent: FeedRecipe[]; random: FeedRecipe[] }

export const getMyRecipes = async (): Promise<RecipeDetail[]> =>
  apiFetch('/recipes/me', { method: 'GET' })

export const getFeed = async (): Promise<FeedResult> =>
  apiFetch('/recipes/feed', { method: 'GET' })

export const getAllRecipes = async (): Promise<RecipeDetail[]> => {
  return await apiFetch('/recipes', { method: 'GET' });
};

export const getRecommendations = async (): Promise<{ recommendations: RecipeDetail[]; preferencesCount: number }> => {
  return await apiFetch('/recipes/recommendations', { method: 'GET' });
};

export const getRecipeById = async (recipeID: number): Promise<RecipeDetail> => {
  return await apiFetch(`/recipes/${recipeID}`, { method: 'GET' });
};

export const getSeedRecipeById = async (seedIndex: number): Promise<RecipeDetail> => {
  return await apiFetch(`/recipes/seed/${seedIndex}`, { method: 'GET' });
};

export const saveSeedRecipe = async (seedIndex: number): Promise<RecipeDetail> => {
  return await apiFetch(`/recipes/seed/${seedIndex}/save`, { method: 'POST' });
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
      tagIDs: form.tagIDs || [],
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
