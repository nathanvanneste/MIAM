import { apiFetch } from '@/src/config/api'
import { supabase } from '@/src/config/supabase';
import { CreateRecipeDTO, Recipe  } from '../types/recipe'
import { uploadRecipePhoto } from './storage.service';

export const getMyRecipes = async (): Promise<Recipe[]> => {
  return await apiFetch('/recipes/me', {
    method: 'GET',
  });
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

