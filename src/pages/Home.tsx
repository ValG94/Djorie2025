import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Scale, TrendingUp, GraduationCap } from 'lucide-react';
import {ScrollToTop} from '../components/scrollToTop';

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/djorie polo blanc.jpeg"
            alt="Dr Serge Ghislain Djorie"
            className="w-full h-full object-cover object-[center_20%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/80 to-red-900/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            {t('home.hero.title')}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-yellow-300 font-semibold">
            {t('home.hero.subtitle')}
          </p>

          <div className="space-y-4 mb-12">
            <p className="text-2xl md:text-4xl font-bold text-white">
              {t('home.hero.slogan1')}
            </p>
            <p className="text-xl md:text-2xl text-blue-100">
              {t('home.hero.slogan2')}
            </p>
            <p className="text-lg md:text-xl text-green-300 font-semibold">
              {t('home.hero.slogan3')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/citizen"
              className="bg-white text-blue-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition-all hover:scale-105 flex items-center space-x-2"
            >
              <span>{t('home.hero.cta1')}</span>
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/donate"
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all hover:scale-105"
            >
              {t('home.hero.cta2')}
            </Link>
            <Link
              to="/vision"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-blue-900 transition-all hover:scale-105"
            >
              {t('home.hero.cta3')}
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white rounded-full" />
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="/djorie assis fauteuil rouge.jpg"
                alt="Dr Serge Ghislain Djorie"
                className="rounded-2xl shadow-2xl"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-blue-900 mb-6">
                {t('home.about.title')}
              </h2>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                {t('home.about.description')}
              </p>
              <Link
                to="/biography"
                className="inline-flex items-center space-x-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
              >
                <span>{t('common.learnMore')}</span>
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Shield, label: t('home.stats.security'), color: 'text-red-600' },
              { icon: Scale, label: t('home.stats.justice'), color: 'text-blue-600' },
              { icon: TrendingUp, label: t('home.stats.economy'), color: 'text-green-600' },
              { icon: GraduationCap, label: t('home.stats.education'), color: 'text-yellow-600' },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-2xl transition-shadow"
              >
                <stat.icon size={48} className={`mx-auto mb-4 ${stat.color}`} />
                <p className="text-lg font-semibold text-gray-800">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-blue-900 to-red-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            {t('home.hero.slogan1')}
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            {t('home.hero.slogan2')}
          </p>
          <Link
            to="/program"
            className="inline-block bg-white text-blue-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition-all hover:scale-105"
          >
            {t('nav.program')}
          </Link>
        </div>
      </section>
      <ScrollToTop />
    </div>
  );
}
