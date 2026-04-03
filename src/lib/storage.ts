import { supabase } from './supabase';

/**
 * Upload d'un fichier vers le bucket 'media' de Supabase
 * Retourne l'URL publique de l'image
 */
export async function uploadImage(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('media')
    .upload(filePath, file);

  if (uploadError) {
    throw new Error(`Erreur lors de l'envoi: ${uploadError.message}`);
  }

  const { data } = supabase.storage
    .from('media')
    .getPublicUrl(filePath);

  return data.publicUrl;
}
