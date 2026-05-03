import { apiFetch } from './api.service';

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
    body: JSON.stringify({
      avatar,
    }),
  });
}