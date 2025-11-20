import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'fr' ? 'en' : 'fr';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors px-3 py-1.5 rounded-full border border-gray-300 hover:border-blue-600"
      aria-label="Switch language"
    >
      <Globe size={16} />
      <span className="uppercase">{i18n.language}</span>
    </button>
  );
}
