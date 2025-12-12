import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Send, Facebook, X } from 'lucide-react';
import { FaWhatsapp } from "react-icons/fa";

import { supabase } from '../lib/supabase';

export default function Contact() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {

      const { error: insertError } = await supabase
        .from('newsletter_subscribers')
        .insert([{
          email: formData.email,
          name: formData.name || null,
          // language: 'fr',
        }]);

      if (insertError) {
        if (insertError.code === '23505') {
          setError(t('newsletter.form.alreadySubscribed'));
        } else {
          throw insertError;
        }
      } else {
        setSuccess(true);
        setFormData({ email: '', name: '' });
      }
    } catch (err) {
      setError(t('newsletter.form.error'));
      console.error('Error subscribing:', err);
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: Mail, label: t('contact.info.email'), value: 'djorie2000@yahoo.fr' },
    { icon: Phone, label: t('contact.info.phone'), value: '(+236) 75181883' },
    { icon: FaWhatsapp, label: t('WhatsApp'), value: '(+236) 72407489' },
    { icon: MapPin, label: t('contact.info.address'), value: 'Bangui, République Centrafricaine' },
  ];

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', href: 'https://www.facebook.com/serge.djorie', color: 'hover:text-blue-600' },
    { icon: X, label: 'X ex Twitter', href: 'https://x.com/sergedjorie?s=11', color: 'hover:text-blue-400' },
    // { icon: Youtube, label: 'YouTube', href: '#', color: 'hover:text-red-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <section className="relative py-20 bg-gradient-to-r from-blue-900 to-green-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">{t('contact.title')}</h1>
          <p className="text-xl text-blue-100">{t('contact.subtitle')}</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {t('contact.info.title')}
              </h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <info.icon className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{info.label}</p>
                      <p className="text-gray-600">{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {t('contact.social.title')}
                </h3>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`bg-gray-100 p-4 rounded-full transition-all ${social.color}`}
                      aria-label={social.label}
                    >
                      <social.icon size={24} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('newsletter.title')}
              </h2>
              <p className="text-gray-600 mb-8">
                {t('newsletter.subtitle')}
              </p>

              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                  {t('newsletter.form.success')}
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                  {error}
                </div>
              )}

              <form onSubmit={handleNewsletterSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('newsletter.form.email')} *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('newsletter.form.name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <span>{loading ? t('newsletter.form.subscribing') : t('newsletter.form.subscribe')}</span>
                  <Send size={20} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
