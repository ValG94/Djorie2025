import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Scale, TrendingUp, GraduationCap, Sprout, Building } from 'lucide-react';
import { supabase } from '../lib/supabase';

const iconMap: Record<string, any> = {
  shield: Shield,
  scale: Scale,
  'trending-up': TrendingUp,
  'graduation-cap': GraduationCap,
  sprout: Sprout,
  building: Building,
};

const colorMap: Record<string, string> = {
  red: 'from-red-600 to-red-700',
  blue: 'from-blue-600 to-blue-700',
  green: 'from-green-600 to-green-700',
  yellow: 'from-yellow-600 to-yellow-700',
};

interface ProgramSection {
  id: string;
  title: string;
  title_en: string;
  content: string;
  content_en: string;
  icon: string;
  color: string;
  priority: number;
}

export default function Program() {
  const { t, i18n } = useTranslation();
  const [sections, setSections] = useState<ProgramSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgramSections();
  }, []);

  const fetchProgramSections = async () => {
    try {
      const { data, error } = await supabase
        .from('program_sections')
        .select('*')
        .eq('published', true)
        .order('priority');

      if (error) throw error;
      setSections(data || []);
    } catch (error) {
      console.error('Error fetching program sections:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/programme + slogan.jpeg"
            alt="Programme Électoral 2025"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            {t('program.title')}
          </h1>
          <p className="text-2xl md:text-3xl text-green-300 font-semibold mb-8">
            {t('program.subtitle')}
          </p>
          <div className="h-1 w-48 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 mx-auto" />
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
              <p className="mt-4 text-gray-600">{t('common.loading')}</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Nos Engagements
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Un programme ambitieux et réaliste pour transformer la République Centrafricaine
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sections.map((section) => {
                  const IconComponent = iconMap[section.icon] || Shield;
                  const colorClass = colorMap[section.color] || colorMap.blue;
                  const title = i18n.language === 'en' ? section.title_en : section.title;
                  const content = i18n.language === 'en' ? section.content_en : section.content;

                  return (
                    <div
                      key={section.id}
                      className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-t-4 border-green-500"
                    >
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${colorClass} mb-6`}>
                        <IconComponent size={32} className="text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        {title}
                      </h3>
                      <p className="text-gray-700 leading-relaxed text-lg">
                        {content}
                      </p>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="/lheure a sonne.jpeg"
                alt="Dr Serge Ghislain Djorie"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {t('program.vision')}
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                Notre vision est claire : transformer la Centrafrique en un État moderne, démocratique et prospère,
                où chaque citoyen peut vivre dans la dignité et contribuer au développement national.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-green-500" />
                  <p className="text-lg text-gray-700">
                    Un leadership visionnaire au service du peuple
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-blue-500" />
                  <p className="text-lg text-gray-700">
                    Des solutions concrètes pour les défis d'aujourd'hui
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-yellow-500" />
                  <p className="text-lg text-gray-700">
                    Une Centrafrique unie, prospère et souveraine
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-green-900 via-blue-900 to-red-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Notre Heure est Venue
          </h2>
          <p className="text-2xl text-green-200 mb-8 max-w-3xl mx-auto">
            Ensemble, faisons l'histoire !
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
