import { useTranslation } from 'react-i18next';
import { Globe, Flag, Award, Users } from 'lucide-react';

export default function Vision() {
  const { t } = useTranslation();

  const pillars = [
    {
      icon: Globe,
      title: t('vision.cooperation.title'),
      description: t('vision.cooperation.description'),
      color: 'from-blue-600 to-blue-700',
    },
    {
      icon: Flag,
      title: t('vision.sovereignty.title'),
      description: t('vision.sovereignty.description'),
      color: 'from-red-600 to-red-700',
    },
    {
      icon: Award,
      title: t('vision.excellence.title'),
      description: t('vision.excellence.description'),
      color: 'from-green-600 to-green-700',
    },
    {
      icon: Users,
      title: t('vision.leadership.title'),
      description: t('vision.leadership.description'),
      color: 'from-yellow-600 to-yellow-700',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <section className="relative py-20 bg-gradient-to-r from-green-900 via-blue-900 to-red-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">{t('vision.title')}</h1>
          <p className="text-xl text-blue-100">{t('vision.subtitle')}</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-xl text-gray-700 leading-relaxed">
              {t('vision.intro')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pillars.map((pillar, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all hover:-translate-y-2"
              >
                <div className={`inline-block p-4 rounded-xl bg-gradient-to-r ${pillar.color} mb-6`}>
                  <pillar.icon size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {pillar.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">
              Une Afrique unie et souveraine
            </h2>
            <p className="text-lg text-green-100 max-w-3xl mx-auto leading-relaxed">
              Le panafricanisme moderne que nous portons est fondé sur la coopération pratique,
              le développement endogène et le respect de notre diversité. Une Centrafrique forte
              contribue à une Afrique forte, et inversement.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
