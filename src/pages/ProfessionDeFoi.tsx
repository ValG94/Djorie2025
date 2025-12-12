import { useTranslation } from 'react-i18next';
import { useRef } from 'react';
import PDFPageFlip, { PDFPageFlipRef } from '../components/PDFPageFlip';
import { BookOpen, Download } from 'lucide-react';

export default function ProfessionDeFoi() {
  const { t } = useTranslation();
  const pdfRef = useRef<PDFPageFlipRef>(null);

  // Mapping des thèmes vers les numéros de pages
  const themePages: Record<string, number> = {
    'Économie': 24,
    'Agriculture': 27,
    'Élevage': 30,
    'Mines': 34,
    'Artisanat': 38,  
    'Santé': 110,
    'Éducation': 124,
    'Jeunesse': 110,
    'Sécurité': 97,
    'Industrialisation': 61,
    'Infrastructures': 65,
    'Énergie': 41,
    'Social': 92,
  };

  const handleThemeClick = (theme: string) => {
    const pageNumber = themePages[theme];
    if (pageNumber && pdfRef.current) {
      // Aller à la page (index commence à 0, donc -1)
      pdfRef.current.goToPage(pageNumber - 1);
      
      // Scroll vers le haut pour voir le flipbook
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      console.warn(`Thème "${theme}" non trouvé dans themePages`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* En-tête de la page */}
      <div className="bg-gradient-to-r from-blue-900 via-green-800 to-red-900 text-white py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Titre principal */}
            <div className="flex items-center space-x-4">
              <BookOpen size={40} className="text-yellow-300 hidden md:block" />
              <div className="text-center md:text-left">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-1">
                  Profession de Foi
                </h1>
                <p className="text-lg md:text-xl text-blue-100">
                  Dr Serge Ghislain DJORIE - Présidentielle 2025
                </p>
              </div>
            </div>

            {/* Bouton d'action */}
            <div className="flex items-center">
              {/* Bouton Télécharger PDF */}
              <a
                href="/documents/PROFESSION_FOI_Dr_SG-DJORIE_PRESIDENTIELLE-2025_V1.pdf"
                download
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg shadow-lg font-semibold transition-all hover:scale-105"
                title="Télécharger le PDF"
              >
                <Download size={20} />
                <span className="hidden sm:inline">Télécharger PDF</span>
                <span className="sm:hidden">PDF</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions pour l'utilisation */}
      <div className="bg-blue-900 text-white py-4 px-4 text-center">
        <p className="text-sm md:text-base font-medium">
          📖 Cliquez sur les coins des pages pour tourner • Utilisez les boutons en bas pour naviguer • Zoom disponible • Cliquez sur un thème pour accéder directement au chapitre
        </p>
      </div>

      {/* Composant PageFlip */}
      <PDFPageFlip
        ref={pdfRef}
        pdfUrl="/documents/PROFESSION_FOI_Dr_SG-DJORIE_PRESIDENTIELLE-2025_V1.pdf"
        title="Profession de Foi - Dr Serge Ghislain DJORIE"
      />

      {/* Section informative en bas */}
      <div className="bg-gradient-to-r from-blue-900 via-green-800 to-red-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-10">
            <div className="bg-white/20 rounded-xl p-6 hover:bg-white/25 transition-colors">
              <div className="text-4xl md:text-5xl font-bold text-yellow-300 mb-2">170</div>
              <div className="text-lg font-semibold">Pages de Vision</div>
            </div>
            <div className="bg-white/20 rounded-xl p-6 hover:bg-white/25 transition-colors">
              <div className="text-4xl md:text-5xl font-bold text-yellow-300 mb-2">37</div>
              <div className="text-lg font-semibold">Chapitres Thématiques</div>
            </div>
            <div className="bg-white/20 rounded-xl p-6 hover:bg-white/25 transition-colors">
              <div className="text-4xl md:text-5xl font-bold text-yellow-300 mb-2">2026-2050</div>
              <div className="text-lg font-semibold">Horizon de Développement</div>
            </div>
          </div>

          {/* Thèmes principaux */}
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-6">Thèmes Abordés</h3>
            <p className="text-center text-blue-100 mb-4">Cliquez sur un thème pour naviguer directement vers le chapitre</p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {[
                'Économie',
                'Agriculture',
                'Élevage',
                'Mines',
                'Santé',
                'Éducation',
                'Artisanat',  
                'Sécurité',
                'Industrialisation',
                'Infrastructures',
                'Énergie',
                'Social',
              ].map((theme, index) => (
                <button
                  key={index}
                  onClick={() => handleThemeClick(theme)}
                  className="bg-white/25 rounded-lg px-4 py-3 text-center text-sm font-semibold hover:bg-white/40 hover:scale-105 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
