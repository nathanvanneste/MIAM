import { apiFetch } from '@/src/config/api'
import { CreateRecipeDTO } from '../types/recipe'


export const createRecipe = async (form: CreateRecipeDTO) => {
    return await apiFetch('/recipes', {
        method: 'POST',
        body: JSON.stringify({
            name: form.name,
            portion: form.portions,
            prepTime: form.prepTime,
            cookTime: form.cookTime,
            photo: form.photoUri,
            description: form.description,
            ingredients: form.recipeIngredients,
            steps: form.steps,
        }),
    })
}
