import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Sparkles, Rocket, Target, ArrowRight } from 'lucide-react';

export default function Youth() {
  const { t } = useTranslation();

  const commitments = [
    {
      icon: Sparkles,
      title: t('youth.yearZero.title'),
      description: t('youth.yearZero.description'),
      color: 'from-yellow-600 to-yellow-700',
    },
    {
      icon: Rocket,
      title: t('youth.potential.title'),
      description: t('youth.potential.description'),
      color: 'from-blue-600 to-blue-700',
    },
    {
      icon: Target,
      title: t('youth.engagement.title'),
      description: t('youth.engagement.description'),
      color: 'from-green-600 to-green-700',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-blue-50">
      <section className="relative py-20 bg-gradient-to-r from-yellow-600 via-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">{t('youth.title')}</h1>
          <p className="text-xl text-yellow-100">{t('youth.subtitle')}</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-xl text-gray-700 leading-relaxed">
              {t('youth.intro')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {commitments.map((commitment, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all hover:-translate-y-2 text-center"
              >
                <div className={`inline-block p-4 rounded-xl bg-gradient-to-r ${commitment.color} mb-6`}>
                  <commitment.icon size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {commitment.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {commitment.description}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-yellow-600 to-green-600 rounded-2xl p-12 text-white">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">
                Plus de 60% de la population a moins de 25 ans
              </h2>
              <p className="text-lg text-yellow-100 mb-8 leading-relaxed">
                Cette jeunesse n'est pas un problème, c'est notre plus grande richesse !
                Elle sera au cœur de notre projet de transformation nationale.
                Formation, emploi, entrepreneuriat, innovation : tout sera mis en œuvre
                pour libérer le potentiel de la jeunesse centrafricaine.
              </p>
              <Link
                to="/citizen"
                className="inline-flex items-center space-x-2 bg-white text-yellow-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-50 transition-all hover:scale-105"
              >
                <span>{t('youth.cta')}</span>
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">
                Formation et éducation
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Refonte du système éducatif pour l'adapter aux besoins du 21ᵉ siècle</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Formation professionnelle gratuite dans les secteurs porteurs</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Bourses d'excellence pour les meilleurs étudiants</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-green-900 mb-4">
                Emploi et entrepreneuriat
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Programme d'insertion professionnelle pour les jeunes diplômés</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Fonds de soutien à l'entrepreneuriat jeune</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Incubateurs et pépinières d'entreprises dans tout le pays</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
