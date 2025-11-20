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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <section className="relative py-20 bg-gradient-to-r from-blue-900 via-green-900 to-red-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">{t('program.title')}</h1>
          <p className="text-xl text-blue-100">{t('program.subtitle')}</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
              <p className="mt-4 text-gray-600">{t('common.loading')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sections.map((section) => {
                const IconComponent = iconMap[section.icon] || Shield;
                const colorClass = colorMap[section.color] || colorMap.blue;
                const title = i18n.language === 'en' ? section.title_en : section.title;
                const content = i18n.language === 'en' ? section.content_en : section.content;

                return (
                  <div
                    key={section.id}
                    className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all hover:-translate-y-2"
                  >
                    <div className={`inline-block p-4 rounded-xl bg-gradient-to-r ${colorClass} mb-6`}>
                      <IconComponent size={32} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {content}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-16 bg-gradient-to-r from-blue-600 to-red-600 rounded-2xl p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">
              {t('program.vision')}
            </h2>
            <p className="text-lg text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Notre vision est claire : transformer la Centrafrique en un État moderne, démocratique et prospère,
              où chaque citoyen peut vivre dans la dignité et contribuer au développement national.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
