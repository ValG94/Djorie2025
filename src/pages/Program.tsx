import { useTranslation } from 'react-i18next';
import { 
  Shield, 
  Eye, 
  Globe, 
  Heart, 
  Building2, 
  DollarSign, 
  Palette, 
  Wheat, 
  Zap, 
  Scale,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';

export default function Program() {
  const { t } = useTranslation();

  const programPillars = [
    {
      id: 1,
      icon: Shield,
      color: 'from-red-600 to-red-700',
      bgColor: 'bg-red-50',
      iconBg: 'bg-red-600',
      key: 'defense'
    },
    {
      id: 2,
      icon: Eye,
      color: 'from-blue-900 to-blue-800',
      bgColor: 'bg-blue-50',
      iconBg: 'bg-blue-900',
      key: 'security'
    },
    {
      id: 3,
      icon: Globe,
      color: 'from-green-600 to-green-700',
      bgColor: 'bg-green-50',
      iconBg: 'bg-green-600',
      key: 'diplomacy'
    },
    {
      id: 4,
      icon: Heart,
      color: 'from-pink-600 to-pink-700',
      bgColor: 'bg-pink-50',
      iconBg: 'bg-pink-600',
      key: 'social'
    },
    {
      id: 5,
      icon: Building2,
      color: 'from-gray-700 to-gray-800',
      bgColor: 'bg-gray-50',
      iconBg: 'bg-gray-700',
      key: 'infrastructure'
    },
    {
      id: 6,
      icon: DollarSign,
      color: 'from-yellow-600 to-yellow-700',
      bgColor: 'bg-yellow-50',
      iconBg: 'bg-yellow-600',
      key: 'aid'
    },
    {
      id: 7,
      icon: Palette,
      color: 'from-purple-600 to-purple-700',
      bgColor: 'bg-purple-50',
      iconBg: 'bg-purple-600',
      key: 'culture'
    },
    {
      id: 8,
      icon: Wheat,
      color: 'from-green-700 to-green-800',
      bgColor: 'bg-green-50',
      iconBg: 'bg-green-700',
      key: 'agriculture'
    },
    {
      id: 9,
      icon: Zap,
      color: 'from-orange-600 to-orange-700',
      bgColor: 'bg-orange-50',
      iconBg: 'bg-orange-600',
      key: 'energy'
    },
    {
      id: 10,
      icon: Scale,
      color: 'from-indigo-600 to-indigo-700',
      bgColor: 'bg-indigo-50',
      iconBg: 'bg-indigo-600',
      key: 'justice'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/lheure a sonne.jpeg"
            alt="Programme Électoral 2025"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            {t('program.hero.title')}
          </h1>
          <p className="text-2xl md:text-3xl text-green-300 font-semibold mb-4">
            {t('program.hero.subtitle')}
          </p>
          <p className="text-xl md:text-2xl text-blue-200 max-w-4xl mx-auto">
            {t('program.hero.description')}
          </p>
          <div className="mt-8 h-1 w-48 bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500 mx-auto" />
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              {t('program.intro.title')}
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              {t('program.intro.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Les 10 Piliers */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('program.pillars.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('program.pillars.subtitle')}
            </p>
          </div>

          <div className="space-y-12">
            {programPillars.map((pillar, index) => (
              <div
                key={pillar.id}
                className={`${pillar.bgColor} rounded-3xl p-8 md:p-12 shadow-lg hover:shadow-2xl transition-all duration-300`}
              >
                <div className="flex flex-col md:flex-row md:items-start md:space-x-8">
                  {/* Icône et numéro */}
                  <div className="flex-shrink-0 mb-6 md:mb-0">
                    <div className="relative">
                      <div className={`${pillar.iconBg} w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg`}>
                        <pillar.icon size={40} className="text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-gray-900 shadow-md">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold text-gray-900 mb-3">
                      {t(`program.${pillar.key}.title`)}
                    </h3>
                    <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                      {t(`program.${pillar.key}.subtitle`)}
                    </p>

                    {/* Points clés */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[1, 2, 3, 4, 5, 6].map((pointIndex) => {
                        const pointKey = `program.${pillar.key}.point${pointIndex}`;
                        const pointText = t(pointKey);
                        
                        // Ne pas afficher si la traduction n'existe pas
                        if (pointText === pointKey) return null;

                        return (
                          <div key={pointIndex} className="flex items-start space-x-3">
                            <CheckCircle2 size={20} className={`flex-shrink-0 mt-1 text-${pillar.iconBg.replace('bg-', '')}`} />
                            <p className="text-gray-700 leading-relaxed">{pointText}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="/programme + slogan.jpeg"
                alt="Dr Serge Ghislain Djorie"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {t('program.vision.title')}
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                {t('program.vision.description')}
              </p>
              
              <div className="space-y-4">
                {[1, 2, 3, 4].map((index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <ChevronRight size={24} className="flex-shrink-0 text-green-600 mt-1" />
                    <p className="text-lg text-gray-700">
                      {t(`program.vision.point${index}`)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-900 via-green-800 to-yellow-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t('program.cta.title')}
          </h2>
          <p className="text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            {t('program.cta.description')}
          </p>
          <div className="flex justify-center gap-3">
            <div className="h-2 w-16 bg-blue-500 rounded-full" />
            <div className="h-2 w-16 bg-white rounded-full" />
            <div className="h-2 w-16 bg-green-500 rounded-full" />
            <div className="h-2 w-16 bg-yellow-500 rounded-full" />
            <div className="h-2 w-16 bg-red-500 rounded-full" />
          </div>
        </div>
      </section>
    </div>
  );
}
