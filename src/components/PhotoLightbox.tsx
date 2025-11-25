import { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Photo {
  id: string;
  image_url: string;
  caption: string | null;
  caption_en: string | null;
}

interface PhotoLightboxProps {
  photos: Photo[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  language: string;
}

export default function PhotoLightbox({
  photos,
  currentIndex,
  onClose,
  onNavigate,
  language,
}: PhotoLightboxProps) {
  const currentPhoto = photos[currentIndex];
  const caption = language === 'en' ? currentPhoto?.caption_en : currentPhoto?.caption;

  // Gestion des touches clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        onNavigate(currentIndex - 1);
      } else if (e.key === 'ArrowRight' && currentIndex < photos.length - 1) {
        onNavigate(currentIndex + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, photos.length, onClose, onNavigate]);

  // Bloquer le scroll du body
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!currentPhoto) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center">
      {/* Bouton Fermer */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
        aria-label="Fermer"
      >
        <X size={32} />
      </button>

      {/* Bouton Précédent */}
      {currentIndex > 0 && (
        <button
          onClick={() => onNavigate(currentIndex - 1)}
          className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10"
          aria-label="Photo précédente"
        >
          <ChevronLeft size={48} />
        </button>
      )}

      {/* Bouton Suivant */}
      {currentIndex < photos.length - 1 && (
        <button
          onClick={() => onNavigate(currentIndex + 1)}
          className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10"
          aria-label="Photo suivante"
        >
          <ChevronRight size={48} />
        </button>
      )}

      {/* Image principale */}
      <div className="max-w-7xl max-h-[90vh] px-4">
        <img
          src={currentPhoto.image_url}
          alt={caption || ''}
          className="max-w-full max-h-[80vh] object-contain mx-auto"
        />

        {/* Légende et compteur */}
        <div className="text-center mt-4 text-white">
          {caption && (
            <p className="text-lg mb-2">{caption}</p>
          )}
          <p className="text-sm text-gray-400">
            {currentIndex + 1} / {photos.length}
          </p>
        </div>
      </div>

      {/* Miniatures en bas */}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 p-4 overflow-x-auto">
        <div className="flex gap-2 justify-center">
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              onClick={() => onNavigate(index)}
              className={`flex-shrink-0 ${
                index === currentIndex
                  ? 'ring-4 ring-blue-500'
                  : 'opacity-60 hover:opacity-100'
              } transition-all`}
            >
              <img
                src={photo.image_url}
                alt=""
                className="w-20 h-20 object-cover rounded"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
