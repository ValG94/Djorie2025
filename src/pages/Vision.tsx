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
      borderColor: 'border-blue-600',
    },
    {
      icon: Flag,
      title: t('vision.sovereignty.title'),
      description: t('vision.sovereignty.description'),
      color: 'from-red-600 to-red-700',
      borderColor: 'border-red-600',
    },
    {
      icon: Award,
      title: t('vision.excellence.title'),
      description: t('vision.excellence.description'),
      color: 'from-green-600 to-green-700',
      borderColor: 'border-green-600',
    },
    {
      icon: Users,
      title: t('vision.leadership.title'),
      description: t('vision.leadership.description'),
      color: 'from-yellow-600 to-yellow-700',
      borderColor: 'border-yellow-600',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="relative h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/Djorie costume bleu.jpeg"
            alt="Dr Serge Ghislain Djorie"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 via-green-900/85 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              {t('vision.title')}
            </h1>
            <p className="text-2xl text-green-100 font-light mb-8">
              {t('vision.subtitle')}
            </p>
            <div className="h-1 w-32 bg-gradient-to-r from-green-500 to-blue-500" />
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <p className="text-2xl text-gray-800 leading-relaxed font-light">
              {t('vision.intro')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {pillars.map((pillar, index) => (
              <div
                key={index}
                className={`bg-white rounded-3xl shadow-xl p-10 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-l-8 ${pillar.borderColor}`}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${pillar.color} mb-6`}>
                  <pillar.icon size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {pillar.title}
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-blue-600 to-green-700" />
            <div className="relative z-10 p-16 text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Une Afrique unie et souveraine
              </h2>
              <div className="max-w-4xl mx-auto">
                <p className="text-xl text-green-50 leading-relaxed">
                  Le panafricanisme moderne que nous portons est fondé sur la coopération pratique,
                  le développement endogène et le respect de notre diversité. Une Centrafrique forte
                  contribue à une Afrique forte, et inversement.
                </p>
              </div>
              <div className="mt-8 flex justify-center gap-4">
                <div className="h-2 w-2 rounded-full bg-white" />
                <div className="h-2 w-2 rounded-full bg-green-300" />
                <div className="h-2 w-2 rounded-full bg-blue-300" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
