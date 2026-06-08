import { useState, useRef, ChangeEvent } from 'react';
import { Camera, Loader2, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface AvatarUploadProps {
  currentAvatar?: string;
  username: string;
  onUpload: (file: File) => Promise<void>;
}

export function AvatarUpload({ currentAvatar, username, onUpload }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentAvatar || null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<<HTMLInputElement>(null);

  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase();
  };

  const handleFileChange = async (e: ChangeEvent<<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!allowedTypes.includes(file.type)) {
      alert('Format non supporté. Utilisez JPG, PNG ou WEBP.');
      return;
    }

    if (file.size > maxSize) {
      alert('Fichier trop volumineux (max 2MB).');
      return;
    }

    // Preview locale immédiate
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload vers le serveur
    setIsLoading(true);
    try {
      await onUpload(file);
    } catch (error) {
      console.error('Upload failed:', error);
      alert("Erreur lors de l'upload de l'avatar");
      setPreview(currentAvatar || null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="relative inline-flex flex-col items-center gap-3">
      {/* Avatar avec overlay */}
      <div 
        className="relative group cursor-pointer"
        onClick={() => !isLoading && inputRef.current?.click()}
      >
        <Avatar className="w-28 h-28 sm:w-32 sm:h-32 border-4 border-white shadow-xl">
          <AvatarImage 
            src={preview || undefined} 
            alt={username} 
            className="object-cover"
          />
          <AvatarFallback className="bg-brand text-white text-2xl sm:text-3xl font-bold font-heading">
            {getInitials(username)}
          </AvatarFallback>
        </Avatar>
        
        {/* Overlay hover */}
        <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {isLoading ? (
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          ) : (
            <Camera className="w-8 h-8 text-white" />
          )}
        </div>

        {/* Badge online (vert) */}
        <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full" />
      </div>

      {/* Input file caché */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
        disabled={isLoading}
      />

      {/* Boutons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={isLoading}
          className="rounded-full text-sm"
        >
          <Camera className="w-4 h-4 mr-2" />
          {preview ? 'Changer' : 'Ajouter photo'}
        </Button>
        
        {preview && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="rounded-full text-red-500 hover:text-red-600 hover:bg-red-50 text-sm"
          >
            <X className="w-4 h-4 mr-2" />
            Supprimer
          </Button>
        )}
      </div>
    </div>
  );
    }
    
