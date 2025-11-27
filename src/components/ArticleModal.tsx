import { X, Calendar, FileText, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Article {
  id: string;
  title: string;
  title_en: string;
  content: string;
  content_en: string;
  image_url: string | null;
  pdf_url: string | null;
  category: string;
  created_at: string;
}

interface ArticleModalProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenPDF?: (url: string, title: string) => void;
}

export default function ArticleModal({ article, isOpen, onClose, onOpenPDF }: ArticleModalProps) {
  const { i18n } = useTranslation();

  if (!isOpen || !article) return null;

  const title = i18n.language === 'en' ? article.title_en : article.title;
  const content = i18n.language === 'en' ? article.content_en : article.content;
  const hasPDF = article.pdf_url !== null;
  const hasImage = article.image_url !== null;

  // Catégories en français
  const categoryLabels: { [key: string]: string } = {
    campaign: 'Campagne',
    programs: 'Programmes',
    declarations: 'Déclarations',
    mediation: 'Médiation',
    peace2020: 'Paix 2020',
    other: 'Autre',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header avec image de couverture */}
          {hasImage && (
            <div className="relative h-64 md:h-80 overflow-hidden">
              <img
                src={article.image_url ?? undefined}
                alt={title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              
              {/* Bouton fermer sur l'image */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full transition-colors shadow-lg"
              >
                <X size={24} className="text-gray-800" />
              </button>

              {/* Badge PDF si présent */}
              {hasPDF && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-full flex items-center space-x-2 shadow-lg">
                  <FileText size={18} />
                  <span className="text-sm font-semibold">Document PDF disponible</span>
                </div>
              )}
            </div>
          )}

          {/* Bouton fermer si pas d'image */}
          {!hasImage && (
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={onClose}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X size={24} className="text-gray-800" />
              </button>
            </div>
          )}

          {/* Contenu */}
          <div className="overflow-y-auto max-h-[calc(90vh-20rem)] md:max-h-[calc(90vh-22rem)]">
            <div className="p-6 md:p-8">
              {/* Métadonnées */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                  {categoryLabels[article.category] || article.category}
                </span>
                <span className="flex items-center text-sm text-gray-500">
                  <Calendar size={16} className="mr-2" />
                  {new Date(article.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>

              {/* Titre */}
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {title}
              </h2>

              {/* Contenu avec formatage */}
              <div className="prose prose-lg max-w-none">
                {content.split('\n').map((paragraph, index) => (
                  paragraph.trim() ? (
                    <p key={index} className="text-gray-700 leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ) : null
                ))}
              </div>

              {/* Bouton PDF si disponible */}
              {hasPDF && article.pdf_url && onOpenPDF && (
                <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border-2 border-red-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-red-600 rounded-lg">
                        <FileText size={32} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Document PDF Complet
                        </h3>
                        <p className="text-sm text-gray-600">
                          Consultez le document officiel en version PDF
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onOpenPDF(article.pdf_url!, title)}
                      className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors shadow-md"
                    >
                      <FileText size={20} />
                      <span className="font-semibold">Ouvrir le PDF</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
