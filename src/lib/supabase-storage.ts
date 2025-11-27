import { supabase } from './supabase';

/**
 * Upload un fichier vers Supabase Storage
 * @param file Le fichier à uploader
 * @param bucket Le bucket Supabase (ex: 'articles', 'videos', 'thumbnails')
 * @param folder Le dossier dans le bucket (optionnel)
 * @returns L'URL publique du fichier uploadé
 */
export async function uploadFile(
  file: File,
  bucket: string,
  folder?: string
): Promise<string> {
  try {
    // Générer un nom de fichier unique
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    // Upload le fichier
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw error;
    }

    // Récupérer l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Erreur lors de l\'upload du fichier');
  }
}

/**
 * Supprime un fichier de Supabase Storage
 * @param url L'URL du fichier à supprimer
 * @param bucket Le bucket Supabase
 */
export async function deleteFile(url: string, bucket: string): Promise<void> {
  try {
    // Extraire le chemin du fichier depuis l'URL
    const urlParts = url.split(`/${bucket}/`);
    if (urlParts.length < 2) {
      throw new Error('URL invalide');
    }
    
    const filePath = urlParts[1];

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new Error('Erreur lors de la suppression du fichier');
  }
}

/**
 * Valide qu'un fichier est une image ou un PDF
 * @param file Le fichier à valider
 * @param maxSizeMB Taille maximale en MB (défaut: 5MB pour images, 10MB pour PDF)
 */
export function validateMediaFile(file: File, maxSizeMB?: number): boolean {
  const isImage = file.type.startsWith('image/');
  const isPDF = file.type === 'application/pdf';
  
  // Vérifier le type
  if (!isImage && !isPDF) {
    throw new Error('Le fichier doit être une image (JPG, PNG, WEBP) ou un PDF');
  }

  // Taille max par défaut selon le type
  const defaultMaxSize = isPDF ? 10 : 5;
  const maxSize = maxSizeMB || defaultMaxSize;
  
  // Vérifier la taille
  const maxSizeBytes = maxSize * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    throw new Error(`Le fichier ne doit pas dépasser ${maxSize}MB`);
  }

  return true;
}

/**
 * Valide qu'un fichier est une image (fonction conservée pour compatibilité)
 * @param file Le fichier à valider
 * @param maxSizeMB Taille maximale en MB (défaut: 5MB)
 */
export function validateImageFile(file: File, maxSizeMB: number = 5): boolean {
  // Vérifier le type
  if (!file.type.startsWith('image/')) {
    throw new Error('Le fichier doit être une image');
  }

  // Vérifier la taille
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    throw new Error(`L'image ne doit pas dépasser ${maxSizeMB}MB`);
  }

  return true;
}

/**
 * Crée une prévisualisation d'une image
 * @param file Le fichier image
 * @returns Une URL de prévisualisation (data URL)
 */
export function createImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Erreur lors de la lecture du fichier'));
      }
    };
    reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'));
    reader.readAsDataURL(file);
  });
}
