import * as FileSystem from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';
import { supabase } from '../config/supabase';

function getFileExtension(uri: string): string {
  const extension = uri.split('.').pop()?.toLowerCase();

  if (!extension || extension.length > 5) {
    return 'jpg';
  }

  return extension;
}

function getContentType(extension: string): string {
  switch (extension) {
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    case 'jpg':
    case 'jpeg':
    default:
      return 'image/jpeg';
  }
}

export async function uploadAvatar(uri: string, userID: string): Promise<string> {
  const extension = getFileExtension(uri);
  const contentType = getContentType(extension);

  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const filePath = `${userID}/avatar.${extension}`;

  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(filePath, decode(base64), {
      contentType,
      upsert: true,
    });

  if (error) {
    throw error;
  }

  return data.path;
}

export async function getSignedAvatarUrl(path: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from('avatars')
    .createSignedUrl(path, 60 * 60);

  if (error) {
    throw error;
  }

  return data.signedUrl;
}