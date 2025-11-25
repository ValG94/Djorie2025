import { useState, useRef } from 'react';
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
  CheckCircle2,
  ArrowRight,
  Sparkles
} from 'lucide-react';
// import ScrollToTop from '../components/scrollToTop';

export default function Program() {
  const { t } = useTranslation();
  const [selectedPillar, setSelectedPillar] = useState<number | null>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  const handlePillarClick = (pillarId: number) => {
    if (selectedPillar === pillarId) {
      setSelectedPillar(null);
    } else {
      setSelectedPillar(pillarId);
      setTimeout(() => {
        detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }
  };

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
      <section className="py-20 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="text-yellow-500 mr-2" size={32} />
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                {t('program.pillars.title')}
              </h2>
              <Sparkles className="text-yellow-500 ml-2" size={32} />
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('program.pillars.subtitle')}
            </p>
          </div>

          {/* Grille de cartes modernes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {programPillars.map((pillar, index) => (
              <div
                key={pillar.id}
                onClick={() => handlePillarClick(pillar.id)}
                className={`relative group cursor-pointer transform transition-all duration-500 hover:scale-105 ${
                  selectedPillar === pillar.id ? 'scale-105 ring-4 ring-offset-2' : ''
                } ${pillar.bgColor} rounded-2xl p-6 shadow-lg hover:shadow-2xl`}
                // style={selectedPillar === pillar.id ? { ringColor: pillar.iconBg.replace('bg-', '') } : {}}
              >
                {/* Badge numéro */}
                <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-gradient-to-br from-white to-gray-100 shadow-lg flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-900">{String(index + 1).padStart(2, '0')}</span>
                </div>

                {/* Icône avec effet */}
                <div className="mb-4">
                  <div className={`inline-flex ${pillar.iconBg} w-16 h-16 rounded-xl items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <pillar.icon size={32} className="text-white" />
                  </div>
                </div>

                {/* Titre */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                  {t(`program.${pillar.key}.title`)}
                </h3>

                {/* Extrait */}
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                  {t(`program.${pillar.key}.subtitle`)}
                </p>

                {/* Indicateur d'expansion */}
                <div className="flex items-center text-sm font-semibold text-gray-700 group-hover:text-gray-900">
                  <span>{selectedPillar === pillar.id ? t('program.showLess') : t('program.showMore')}</span>
                  <ArrowRight size={16} className={`ml-2 transition-transform duration-300 ${
                    selectedPillar === pillar.id ? 'rotate-90' : 'group-hover:translate-x-1'
                  }`} />
                </div>
              </div>
            ))}
          </div>

          {/* Section détails du pilier sélectionné */}
          {selectedPillar && (
            <div ref={detailsRef} className="mt-12 pt-8 animate-fadeIn scroll-mt-20">
              {programPillars.filter(p => p.id === selectedPillar).map((pillar) => (
                <div
                  key={pillar.id}
                  className={`${pillar.bgColor} rounded-3xl p-8 md:p-12 shadow-2xl border-4 border-white`}
                >
                  <div className="flex flex-col md:flex-row md:items-start md:space-x-8">
                    {/* Icône grande */}
                    <div className="flex-shrink-0 mb-6 md:mb-0">
                      <div className={`${pillar.iconBg} w-24 h-24 rounded-3xl flex items-center justify-center shadow-xl`}>
                        <pillar.icon size={48} className="text-white" />
                      </div>
                    </div>

                    {/* Contenu détaillé */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
                          {t(`program.${pillar.key}.title`)}
                        </h3>
                        <span className="text-5xl font-bold text-gray-300">
                          {String(programPillars.findIndex(p => p.id === pillar.id) + 1).padStart(2, '0')}
                        </span>
                      </div>

                      <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                        {t(`program.${pillar.key}.subtitle`)}
                      </p>

                      {/* Points clés avec animation */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4, 5, 6].map((pointIndex) => {
                          const pointKey = `program.${pillar.key}.point${pointIndex}`;
                          const pointText = t(pointKey);

                          if (pointText === pointKey) return null;

                          return (
                            <div
                              key={pointIndex}
                              className="flex items-start space-x-3 p-3 bg-white/60 rounded-lg hover:bg-white/90 transition-all duration-200"
                              style={{ animationDelay: `${pointIndex * 50}ms` }}
                            >
                              <CheckCircle2 size={20} className="flex-shrink-0 mt-1" style={{ color: pillar.iconBg.replace('bg-', '') }} />
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
          )}
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="/affiche heure sonné.jpeg"
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

      {/* <ScrollToTop /> */}
    </div>
  );
}
