import { apiFetch } from '@/src/config/api'
import { ShoppingList, CreateShoppingItemDTO, UpdateShoppingItemDTO } from '@/src/types/shoppingList'

// À brancher quand le back aura l'endpoint
export const getMyList = async (): Promise<ShoppingList> => {
    return await apiFetch('/shopping-lists/me')
}

// À brancher quand le back aura l'endpoint
export const getMyGroups = async () => {
    return await apiFetch('/groups/me')
}

export const getList = async (listID: number): Promise<ShoppingList> => {
    return await apiFetch(`/shopping-lists/${listID}`)
}

export const addItem = async (listID: number, item: CreateShoppingItemDTO) => {
    return await apiFetch(`/shopping-lists/${listID}/items`, {
        method: 'POST',
        body: JSON.stringify(item),
    })
}

export const toggleItem = async (itemID: number) => {
    return await apiFetch(`/shopping-lists/items/${itemID}/toggle`, {
        method: 'PATCH',
    })
}

export const removeItem = async (itemID: number) => {
    return await apiFetch(`/shopping-lists/items/${itemID}`, {
        method: 'DELETE',
    })
}

export const updateItem = async (itemID: number, dto: UpdateShoppingItemDTO) => {
    return await apiFetch(`/shopping-lists/items/${itemID}`, {
        method: 'PATCH',
        body: JSON.stringify(dto),
    })
}