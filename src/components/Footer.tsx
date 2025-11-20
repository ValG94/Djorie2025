import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Facebook, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();

  const quickLinks = [
    { name: t('nav.biography'), href: '/biography' },
    { name: t('nav.vision'), href: '/vision' },
    { name: t('nav.program'), href: '/program' },
    { name: t('nav.youth'), href: '/youth' },
    { name: t('nav.news'), href: '/news' },
    { name: t('nav.videos'), href: '/videos' },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="bg-gradient-to-br from-blue-900 via-blue-800 to-red-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img
                src="/armoirie.svg"
                alt="Logo"
                className="h-12 w-12 brightness-0 invert"
              />
              <div className="flex flex-col">
                <span className="font-bold text-lg">Dr Serge Ghislain Djorie</span>
                <span className="text-xs text-yellow-300 font-semibold">Présidentielle 2025</span>
              </div>
            </div>
            <p className="text-sm text-blue-100 mb-4">
              {t('footer.slogan')}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-blue-100 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">{t('contact.info.title')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 text-sm text-blue-100">
                <Mail size={18} className="mt-0.5 flex-shrink-0" />
                <span>contact@djorie2025.cf</span>
              </li>
              <li className="flex items-start space-x-2 text-sm text-blue-100">
                <Phone size={18} className="mt-0.5 flex-shrink-0" />
                <span>+236 XX XX XX XX</span>
              </li>
              <li className="flex items-start space-x-2 text-sm text-blue-100">
                <MapPin size={18} className="mt-0.5 flex-shrink-0" />
                <span>Bangui, République Centrafricaine</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">{t('newsletter.title')}</h3>
            <p className="text-sm text-blue-100 mb-4">
              {t('newsletter.subtitle')}
            </p>
            <Link
              to="/contact"
              className="inline-block bg-white text-blue-900 px-6 py-2 rounded-full font-semibold text-sm hover:bg-yellow-300 transition-colors"
            >
              {t('newsletter.form.subscribe')}
            </Link>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-blue-100">
            {t('footer.copyright')}
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-sm text-blue-100 hover:text-white transition-colors">
              {t('footer.privacy')}
            </Link>
            <Link to="/terms" className="text-sm text-blue-100 hover:text-white transition-colors">
              {t('footer.terms')}
            </Link>
            <Link to="/admin/login" className="text-sm text-blue-100 hover:text-white transition-colors">
              Administration
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
