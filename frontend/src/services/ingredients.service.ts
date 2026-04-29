import { API_URL } from "../config/api";
import type { Ingredient } from "../types/ingredient";

export async function getIngredientById(id: number): Promise<Ingredient> {
    const response = await fetch(`${API_URL}/ingredients/${id}`);

    if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
    }

    return await response.json();
}

