import { useTranslation } from 'react-i18next';
import { Microscope, Shield, Megaphone, Users } from 'lucide-react';

export default function Biography() {
  const { t } = useTranslation();

  const milestones = [
    {
      icon: Microscope,
      title: t('biography.researcher.title'),
      description: t('biography.researcher.description'),
      color: 'from-blue-600 to-blue-700',
    },
    {
      icon: Shield,
      title: t('biography.military.title'),
      description: t('biography.military.description'),
      color: 'from-red-600 to-red-700',
    },
    {
      icon: Megaphone,
      title: t('biography.minister.title'),
      description: t('biography.minister.description'),
      color: 'from-green-600 to-green-700',
    },
    {
      icon: Users,
      title: t('biography.president.title'),
      description: t('biography.president.description'),
      color: 'from-yellow-600 to-yellow-700',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <section className="relative py-20 bg-gradient-to-r from-blue-900 to-red-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">{t('biography.title')}</h1>
          <p className="text-xl text-blue-100">{t('biography.subtitle')}</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div className="flex items-center justify-center">
              <img
                src="/djorie fauteuil retouche.jpg"
                alt="Dr Serge Ghislain Djorie"
                className="rounded-2xl shadow-2xl max-w-full h-auto"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-blue-900 mb-6">
                Dr Serge Ghislain Djorie
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Né en République Centrafricaine, le Dr Serge Ghislain Djorie incarne une nouvelle génération de leaders africains : compétents, engagés et résolument tournés vers l'avenir.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Sa trajectoire unique combine excellence académique, service militaire, expérience gouvernementale et engagement politique pour le renouveau de la Centrafrique.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Candidat officiel à l'élection présidentielle du 28 décembre 2025, il porte une vision panafricaniste moderne et un projet de société ambitieux pour bâtir une Centrafrique digne, stable et souveraine.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all hover:-translate-y-2"
              >
                <div className={`inline-block p-4 rounded-xl bg-gradient-to-r ${milestone.color} mb-6`}>
                  <milestone.icon size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {milestone.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {milestone.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
