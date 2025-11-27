import { X, Download, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PDFViewerProps {
  pdfUrl: string;
  title: string;
  onClose: () => void;
}

export default function PDFViewer({ pdfUrl, title, onClose }: PDFViewerProps) {
  const { t } = useTranslation();

  // Fermeture avec ESC
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  // Ajouter l'écouteur d'événement
  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden'; // Bloquer le scroll

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto'; // Restaurer le scroll
    };
  }, []);

  const handleDownload = () => {
    window.open(pdfUrl, '_blank');
  };

  const handleFullscreen = () => {
    window.open(pdfUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      {/* Overlay cliquable pour fermer */}
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full h-full max-w-6xl max-h-[90vh] m-4 bg-white rounded-lg shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 truncate">
              {title}
            </h2>
            <p className="text-sm text-gray-500">{t('news.pdfViewer.viewing')}</p>
          </div>

          <div className="flex items-center space-x-2">
            {/* Bouton Télécharger */}
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              title={t('news.downloadPDF')}
            >
              <Download size={18} />
              <span className="hidden sm:inline">{t('news.downloadPDF')}</span>
            </button>

            {/* Bouton Plein écran */}
            <button
              onClick={handleFullscreen}
              className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
              title={t('news.pdfViewer.fullscreen')}
            >
              <Maximize2 size={20} />
            </button>

            {/* Bouton Fermer */}
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
              title={t('news.pdfViewer.close')}
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Visionneuse PDF */}
        <div className="flex-1 overflow-hidden bg-gray-100">
          <iframe
            src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
            className="w-full h-full border-0"
            title={title}
          />
        </div>

        {/* Footer */}
        <div className="p-3 border-t bg-gray-50 rounded-b-lg">
          <p className="text-xs text-gray-500 text-center">
            {t('news.pdfViewer.hint')}
          </p>
        </div>
      </div>
    </div>
  );
}

// Import React pour useEffect
import React from 'react';
