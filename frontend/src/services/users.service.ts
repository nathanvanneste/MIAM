import { apiFetch } from './api.service';
import type { Recipe } from '../types/recipe';

export type User = {
  userID: string;
  email: string;
  firstName: string;
  lastName: string;
  pseudo: string;
  avatar?: string | null;
};

export async function getUsers(): Promise<User[]> {
  return apiFetch('/users', {
    method: 'GET',
  });
}

export async function getMe(): Promise<User> {
  return apiFetch('/users/me', {
    method: 'GET',
  });
}

export async function updateMyAvatar(avatar: string): Promise<User> {
  return apiFetch('/users/me/avatar', {
    method: 'PATCH',
    body: JSON.stringify({ avatar }),
  });
}

export async function updateMe(data: {
  firstName?: string
  lastName?: string
  pseudo?: string
}): Promise<User> {
  return apiFetch('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteMe(): Promise<void> {
  await apiFetch('/users/me', { method: 'DELETE' });
}

export async function getUserRecipes(userID: string): Promise<Recipe[]> {
  return apiFetch(`/users/${userID}/recipes`, { method: 'GET' });
}