import { useTranslation } from 'react-i18next';
import { Microscope, Shield, Megaphone, Users, Award, BookOpen, Globe, Target } from 'lucide-react';

export default function Biography() {
  const { t } = useTranslation();

  const milestones = [
    {
      icon: Microscope,
      title: t('biography.researcher.title'),
      description: t('biography.researcher.description'),
      color: 'from-blue-600 to-blue-700',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Shield,
      title: t('biography.military.title'),
      description: t('biography.military.description'),
      color: 'from-red-600 to-red-700',
      bgColor: 'bg-red-50',
    },
    {
      icon: Megaphone,
      title: t('biography.minister.title'),
      description: t('biography.minister.description'),
      color: 'from-green-600 to-green-700',
      bgColor: 'bg-green-50',
    },
    {
      icon: Users,
      title: t('biography.president.title'),
      description: t('biography.president.description'),
      color: 'from-yellow-600 to-yellow-700',
      bgColor: 'bg-yellow-50',
    },
  ];

  const qualities = [
    {
      icon: Award,
      title: t('biography.qualities.academic.title'),
      description: t('biography.qualities.academic.description'),
    },
    {
      icon: BookOpen,
      title: t('biography.qualities.government.title'),
      description: t('biography.qualities.government.description'),
    },
    {
      icon: Globe,
      title: t('biography.qualities.panafrican.title'),
      description: t('biography.qualities.panafrican.description'),
    },
    {
      icon: Target,
      title: t('biography.qualities.citizen.title'),
      description: t('biography.qualities.citizen.description'),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section avec photo */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/djorie-bio.jpg"
            alt="Dr Serge Ghislain Djorie"
            className="w-full h-full object-cover"
            style={{ objectPosition: '50% 30%' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 via-blue-800/90 to-green-700/85" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              {t('biography.title')}
            </h1>
            <p className="text-2xl md:text-3xl mb-4 text-yellow-300 font-semibold">
              Dr Serge Ghislain Djorie
            </p>
            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
              {t('biography.subtitle')}
            </p>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white rounded-full" />
          </div>
        </div>
      </section>

      {/* Section Introduction */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-blue-900 mb-12 text-center">
            {t('biography.introTitle')}
          </h2>

          {/* Section avec photo et texte */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div className="flex items-center justify-center">
              <img
                src="/djorie fauteuil retouche.jpg"
                alt="Dr Serge Ghislain Djorie"
                className="rounded-2xl shadow-2xl max-w-full h-auto hover:shadow-3xl transition-shadow"
              />
            </div>
            <div className="flex flex-col justify-center">
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
                  {t('biography.intro1').split(t('biography.intro1Bold'))[0]}
                  <span className="font-bold text-blue-900">{t('biography.intro1Bold')}</span>
                  {t('biography.intro1').split(t('biography.intro1Bold'))[1]}.
                </p>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
                  {t('biography.intro2').split(t('biography.intro2Academic'))[0]}
                  <span className="font-bold text-green-700">{t('biography.intro2Academic')}</span>
                  {', '}
                  <span className="font-bold text-red-700">{t('biography.intro2Military')}</span>
                  {', '}
                  <span className="font-bold text-green-700">{t('biography.intro2Government')}</span>
                  {' et '}
                  <span className="font-bold text-yellow-700">{t('biography.intro2Political')}</span>
                  {' pour le renouveau de la Centrafrique.'}
                </p>
                <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-6 text-white">
                  <p className="text-lg md:text-xl leading-relaxed">
                    {t('biography.intro3').split(t('biography.intro3Date'))[0]}
                    <span className="font-bold">{t('biography.intro3Date')}</span>
                    {t('biography.intro3').split(t('biography.intro3Date'))[1]}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Qualités clés */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {qualities.map((quality, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all hover:-translate-y-1"
                >
                  <div className="flex items-start space-x-4">
                    <div className="bg-gradient-to-br from-blue-600 to-green-600 p-3 rounded-lg flex-shrink-0">
                      <quality.icon size={28} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {quality.title}
                      </h3>
                      <p className="text-gray-600">
                        {quality.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Parcours professionnel */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
            {t('biography.parcours.title')}
          </h2>
          <p className="text-xl text-center text-gray-600 mb-16 max-w-3xl mx-auto">
            {t('biography.parcours.subtitle')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={`${milestone.bgColor} rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all hover:-translate-y-2 border-2 border-transparent hover:border-blue-300`}
              >
                <div className="flex items-start space-x-6">
                  <div className={`flex-shrink-0 p-4 rounded-xl bg-gradient-to-r ${milestone.color} shadow-lg`}>
                    <milestone.icon size={40} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-4">
                      <span className={`inline-block w-8 h-8 rounded-full bg-gradient-to-r ${milestone.color} text-white font-bold flex items-center justify-center mr-3`}>
                        {index + 1}
                      </span>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {milestone.title}
                      </h3>
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-900 via-green-800 to-yellow-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t('biography.cta.title')}
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            {t('biography.cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/vision"
              className="inline-flex items-center space-x-2 bg-white text-blue-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition-all hover:scale-105 shadow-xl"
            >
              <span>{t('biography.cta.visionButton')}</span>
              <span>→</span>
            </a>
            <a
              href="/program"
              className="inline-flex items-center space-x-2 border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-blue-900 transition-all hover:scale-105"
            >
              <span>{t('biography.cta.programButton')}</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
