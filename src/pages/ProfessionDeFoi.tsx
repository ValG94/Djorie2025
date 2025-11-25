import { useTranslation } from 'react-i18next';
import PDFFlipbook from '../components/PDFFlipbook';
import { BookOpen } from 'lucide-react';

export default function ProfessionDeFoi() {
  const { t } = useTranslation();

  // Table des matières basée sur le PDF fourni
  const tableOfContents = [
    { title: 'Centrafrique Horizon 2026-2050', page: 19 },
    { title: 'Profession de Foi', page: 19 },
    { title: 'I. Historique', page: 19 },
    { title: 'Stabilité et Démocratie', page: 21 },
    { title: 'Analyse de la Situation', page: 23 },
    { title: "L'économie", page: 23 },
    { title: 'Contexte Agricole de la RCA', page: 26 },
    { title: "L'Élevage", page: 29 },
    { title: 'Les Mines', page: 33 },
    { title: 'Code Minier, Circuit d\'Achat et de Vente', page: 33 },
    { title: "L'Artisanat", page: 37 },
    { title: "L'Exploitation du Pétrole et le Raffinage National", page: 40 },
    { title: 'Les Conventions et les Contrats', page: 43 },
    { title: 'Le Code des Investissements en RCA', page: 46 },
    { title: "Les Industries et l'Industrialisation", page: 49 },
    { title: "L'Agro-Alimentaire et l'Agro-Business", page: 53 },
    { title: "Le Centre Commercial d'Achat", page: 56 },
    { title: 'Le Tourisme', page: 58 },
    { title: 'La Santé', page: 61 },
    { title: "L'Éducation", page: 71 },
    { title: 'La Jeunesse, les Sports et la Culture', page: 82 },
    { title: 'La Sécurité et la Défense', page: 88 },
    { title: 'La Justice', page: 99 },
    { title: 'Les Droits de l\'Homme', page: 104 },
    { title: 'La Communication et les Médias', page: 107 },
    { title: 'Les Infrastructures', page: 112 },
    { title: 'L\'Énergie et l\'Eau', page: 119 },
    { title: 'L\'Environnement', page: 125 },
    { title: 'Les Affaires Sociales', page: 129 },
    { title: 'L\'Emploi et la Formation Professionnelle', page: 134 },
    { title: 'La Fonction Publique', page: 138 },
    { title: 'Les Finances Publiques', page: 142 },
    { title: 'La Décentralisation', page: 147 },
    { title: 'Les Affaires Étrangères', page: 151 },
    { title: 'La Diaspora', page: 156 },
    { title: 'Les Réfugiés et Déplacés', page: 159 },
    { title: 'La Réconciliation Nationale', page: 162 },
    { title: 'Conclusion', page: 166 },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* En-tête de la page */}
      <div className="bg-gradient-to-r from-blue-900 via-green-800 to-red-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-4">
            <BookOpen size={48} className="text-yellow-300" />
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                {t('professionDeFoi.title')}
              </h1>
              <p className="text-xl text-blue-100">
                {t('professionDeFoi.subtitle')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions pour mobile */}
      <div className="bg-blue-900 text-white py-4 px-4 text-center md:hidden">
        <p className="text-sm">
          💡 Utilisez les flèches ← → pour naviguer entre les pages
        </p>
      </div>

      {/* Composant Flipbook */}
      <PDFFlipbook
        pdfUrl="/documents/PROFESSION_FOI_Dr_SG-DJORIE_PRESIDENTIELLE-2025_V1.pdf"
        tableOfContents={tableOfContents}
      />

      {/* Bouton de téléchargement (optionnel) */}
      <div className="fixed bottom-24 right-4 z-30">
        <a
          href="/documents/PROFESSION_FOI_Dr_SG-DJORIE_PRESIDENTIELLE-2025_V1.pdf"
          download
          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full shadow-2xl font-semibold transition-all hover:scale-105"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span className="hidden sm:inline">{t('professionDeFoi.download')}</span>
          <span className="sm:hidden">PDF</span>
        </a>
      </div>
    </div>
  );
}
