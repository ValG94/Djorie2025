import { useTranslation } from 'react-i18next';
import PDFPageFlip from '../components/PDFPageFlip';
import { BookOpen, Download, ExternalLink } from 'lucide-react';

export default function ProfessionDeFoi() {
  const { t } = useTranslation();

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

            {/* Boutons d'action */}
            <div className="flex items-center space-x-3">
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

              {/* Bouton Ouvrir Flipsnack */}
              <a
                href="https://www.flipsnack.com/F6C6F87A9F7/profession-de-foi-dr-sg-djorie_presidentielle-2025_v1.html"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg shadow-lg font-semibold transition-all hover:scale-105"
                title="Voir sur Flipsnack"
              >
                <ExternalLink size={20} />
                <span className="hidden md:inline">Flipsnack</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions pour l'utilisation */}
      <div className="bg-blue-900/50 text-white py-3 px-4 text-center">
        <p className="text-sm md:text-base">
          📖 Cliquez sur les coins des pages pour tourner • Utilisez les boutons en bas pour naviguer • Zoom disponible
        </p>
      </div>

      {/* Composant PageFlip */}
      <PDFPageFlip
        pdfUrl="/documents/PROFESSION_FOI_Dr_SG-DJORIE_PRESIDENTIELLE-2025_V1.pdf"
        title="Profession de Foi - Dr Serge Ghislain DJORIE"
      />

      {/* Section informative en bas */}
      <div className="bg-gradient-to-r from-blue-900 via-green-800 to-red-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-4xl font-bold text-yellow-300 mb-2">170</div>
              <div className="text-lg">Pages de Vision</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-4xl font-bold text-yellow-300 mb-2">37</div>
              <div className="text-lg">Chapitres Thématiques</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-4xl font-bold text-yellow-300 mb-2">2026-2050</div>
              <div className="text-lg">Horizon de Développement</div>
            </div>
          </div>

          {/* Thèmes principaux */}
          <div className="mt-8">
            <h3 className="text-2xl font-bold text-center mb-6">Thèmes Abordés</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {[
                'Économie',
                'Agriculture',
                'Élevage',
                'Mines',
                'Santé',
                'Éducation',
                'Jeunesse',
                'Sécurité',
                'Justice',
                'Infrastructures',
                'Énergie',
                'Environnement',
              ].map((theme, index) => (
                <div
                  key={index}
                  className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-center text-sm font-semibold hover:bg-white/30 transition-colors"
                >
                  {theme}
                </div>
              ))}
            </div>
          </div>

          {/* Note sur Flipsnack */}
          <div className="mt-8 text-center">
            <p className="text-sm text-blue-100">
              💡 Pour une expérience optimale avec effet 3D professionnel, visitez notre{' '}
              <a
                href="https://www.flipsnack.com/F6C6F87A9F7/profession-de-foi-dr-sg-djorie_presidentielle-2025_v1.html"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-yellow-300 transition-colors"
              >
                version Flipsnack
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
