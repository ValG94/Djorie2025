import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  Briefcase, 
  Heart, 
  Palette, 
  Wrench,
  BookOpen,
  Users,
  TrendingUp,
  Award,
  Lightbulb,
  Target,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export default function Youth() {
  const { t } = useTranslation();

  const educationPoints = [
    { icon: BookOpen, text: t('youth.education.point1') },
    { icon: GraduationCap, text: t('youth.education.point2') },
    { icon: Award, text: t('youth.education.point3') },
    { icon: Users, text: t('youth.education.point4') },
  ];

  const formationPoints = [
    { icon: Wrench, text: t('youth.formation.point1') },
    { icon: Target, text: t('youth.formation.point2') },
    { icon: Lightbulb, text: t('youth.formation.point3') },
    { icon: TrendingUp, text: t('youth.formation.point4') },
  ];

  const employmentPoints = [
    { icon: Briefcase, text: t('youth.employment.point1') },
    { icon: Users, text: t('youth.employment.point2') },
    { icon: TrendingUp, text: t('youth.employment.point3') },
    { icon: Award, text: t('youth.employment.point4') },
  ];

  const healthPoints = [
    { icon: Heart, text: t('youth.health.point1') },
    { icon: CheckCircle2, text: t('youth.health.point2') },
    { icon: Users, text: t('youth.health.point3') },
  ];

  const culturePoints = [
    { icon: Palette, text: t('youth.culture.point1') },
    { icon: Users, text: t('youth.culture.point2') },
    { icon: Award, text: t('youth.culture.point3') },
    { icon: Target, text: t('youth.culture.point4') },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section avec image */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/djorie-youth-hero.jpeg"
            alt="Dr Serge Ghislain Djorie - Jeunesse"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 via-green-800/90 to-yellow-700/85" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            {t('youth.hero.title')}
          </h1>
          <p className="text-2xl md:text-3xl mb-4 text-yellow-300 font-semibold">
            {t('youth.hero.subtitle')}
          </p>
          <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto">
            {t('youth.hero.description')}
          </p>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white rounded-full" />
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-blue-900 mb-6">
              {t('youth.intro.title')}
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              {t('youth.intro.description')}
            </p>
            <div className="bg-yellow-100 border-l-4 border-yellow-600 p-6 rounded-r-lg">
              <p className="text-lg font-semibold text-yellow-900">
                {t('youth.intro.stat')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Axe 1 : Éducation */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-12">
            <div className="bg-blue-600 p-4 rounded-full">
              <GraduationCap size={48} className="text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-center text-blue-900 mb-4">
            {t('youth.education.title')}
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            {t('youth.education.subtitle')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {educationPoints.map((point, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 bg-blue-50 p-6 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="flex-shrink-0">
                  <div className="bg-blue-600 p-3 rounded-lg">
                    <point.icon size={24} className="text-white" />
                  </div>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">{point.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Axe 2 : Formation professionnelle */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-12">
            <div className="bg-green-600 p-4 rounded-full">
              <Wrench size={48} className="text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-center text-green-900 mb-4">
            {t('youth.formation.title')}
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            {t('youth.formation.subtitle')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {formationPoints.map((point, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="flex-shrink-0">
                  <div className="bg-green-600 p-3 rounded-lg">
                    <point.icon size={24} className="text-white" />
                  </div>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">{point.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Axe 3 : Emploi et entrepreneuriat */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-12">
            <div className="bg-yellow-600 p-4 rounded-full">
              <Briefcase size={48} className="text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-center text-yellow-900 mb-4">
            {t('youth.employment.title')}
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            {t('youth.employment.subtitle')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {employmentPoints.map((point, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 bg-yellow-50 p-6 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="flex-shrink-0">
                  <div className="bg-yellow-600 p-3 rounded-lg">
                    <point.icon size={24} className="text-white" />
                  </div>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">{point.text}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-yellow-600 to-green-600 rounded-2xl p-10 text-white">
            <h3 className="text-3xl font-bold mb-4 text-center">
              {t('youth.employment.highlight.title')}
            </h3>
            <p className="text-lg text-center text-yellow-100 leading-relaxed">
              {t('youth.employment.highlight.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Axe 4 : Santé et protection sociale */}
      <section className="py-20 bg-gradient-to-br from-red-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-12">
            <div className="bg-red-600 p-4 rounded-full">
              <Heart size={48} className="text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-center text-red-900 mb-4">
            {t('youth.health.title')}
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            {t('youth.health.subtitle')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {healthPoints.map((point, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="bg-red-600 p-4 rounded-full mb-4">
                  <point.icon size={32} className="text-white" />
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">{point.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Axe 5 : Culture, sport et créativité */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-12">
            <div className="bg-purple-600 p-4 rounded-full">
              <Palette size={48} className="text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-center text-purple-900 mb-4">
            {t('youth.culture.title')}
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            {t('youth.culture.subtitle')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {culturePoints.map((point, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 bg-purple-50 p-6 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="flex-shrink-0">
                  <div className="bg-purple-600 p-3 rounded-lg">
                    <point.icon size={24} className="text-white" />
                  </div>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">{point.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Final */}
      <section className="py-20 bg-gradient-to-r from-blue-900 via-green-800 to-yellow-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t('youth.cta.title')}
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            {t('youth.cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/citizen"
              className="inline-flex items-center space-x-2 bg-white text-blue-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition-all hover:scale-105"
            >
              <span>{t('youth.cta.button1')}</span>
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/program"
              className="inline-flex items-center space-x-2 border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-blue-900 transition-all hover:scale-105"
            >
              <span>{t('youth.cta.button2')}</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
