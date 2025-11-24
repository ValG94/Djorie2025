import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.biography'), href: '/biography' },
    { name: t('nav.vision'), href: '/vision' },
    { name: t('nav.program'), href: '/program' },
    { name: t('nav.professionDeFoi'), href: '/profession-de-foi' },
    { name: t('nav.youth'), href: '/youth' },
    { name: t('nav.news'), href: '/news' },
    { name: t('nav.videos'), href: '/videos' },
    { name: t('nav.citizen'), href: '/citizen' },
    { name: t('nav.contact'), href: '/contact' },
  ];

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-md z-50">
      <nav className="max-w-[1400px] mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="/armoirie.svg"
              alt="Logo"
              className="h-12 w-12"
            />
            <div className="flex flex-col">
              <span className="font-bold text-lg text-blue-900">Dr Serge Ghislain Djorie</span>
              <span className="text-xs text-red-600 font-semibold">Présidentielle 2025</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center space-x-3 xl:space-x-5">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-xs xl:text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap"
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/donate"
              className="bg-gradient-to-r from-blue-600 to-red-600 text-white px-4 xl:px-6 py-2 rounded-full text-xs xl:text-sm font-semibold hover:shadow-lg transition-all whitespace-nowrap"
            >
              {t('nav.donate')}
            </Link>
            <LanguageSwitcher />
          </div>

          <div className="flex lg:hidden items-center space-x-4">
            <LanguageSwitcher />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors py-2"
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/donate"
                onClick={() => setIsMenuOpen(false)}
                className="bg-gradient-to-r from-blue-600 to-red-600 text-white px-6 py-3 rounded-full font-semibold text-center hover:shadow-lg transition-all"
              >
                {t('nav.donate')}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
