import { useState, useCallback } from 'react';

interface UseAvatarReturn {
  uploadAvatar: (file: File, userId: string) => Promise<string>;
  isUploading: boolean;
  error: string | null;
}

export function useAvatar(): UseAvatarReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadAvatar = useCallback(async (file: File, userId: string): Promise<string> => {
    setIsUploading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      formData.append('userId', userId);

      // Remplacez par votre vrai endpoint API
      const response = await fetch('/api/users/avatar', {
        method: 'POST',
        body: formData,
        // Ne pas mettre Content-Type, le browser le fait automatiquement avec FormData
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Upload failed');
      }

      const data = await response.json();
      return data.avatarUrl;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, []);

  return { uploadAvatar, isUploading, error };
}
