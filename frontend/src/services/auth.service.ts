import { supabase } from '../config/supabase';
import { RegisterDTO } from '../types/user';
import { apiFetch } from './api.service';

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data;
}

export async function register(form: RegisterDTO) {
  const { data, error } = await supabase.auth.signUp({
    email: form.email,
    password: form.password,
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
      firstName: form.firstName,
      lastName: form.lastName,
      pseudo: form.pseudo,
    }),
  });

  return data;
}


export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
}