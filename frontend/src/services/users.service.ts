import { API_URL } from '../config/api';

export async function getUsers(): Promise<string> {
  const response = await fetch(`${API_URL}/users`);

  if (!response.ok) {
    throw new Error(`Erreur API: ${response.status}`);
  }

  return await response.text();
}