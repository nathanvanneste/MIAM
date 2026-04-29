import { supabase } from '../config/supabase';
import { apiFetch } from './api.service';

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data;
}

export async function signUp(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  pseudo: string,
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  const session = data.session;

  if (!session) {
    throw new Error(
      "Aucune session retournée après l'inscription. Vérifie que la confirmation email est bien désactivée dans Supabase.",
    );
  }

  await apiFetch('/users/me', {
    method: 'POST',
    body: JSON.stringify({
      firstName,
      lastName,
      pseudo,
    }),
  });

  return data;
}


export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
}