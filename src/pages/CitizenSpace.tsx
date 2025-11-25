import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, MessageSquare, Lightbulb, HelpCircle, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Message {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

export default function CitizenSpace() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message_type: 'support',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [publicMessages, setPublicMessages] = useState<Message[]>([]);

  useEffect(() => {
    fetchPublicMessages();
  }, []);

  const fetchPublicMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('citizen_messages')
        .select('id, name, message, created_at')
        .eq('status', 'approved')
        .eq('message_type', 'support')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setPublicMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const { error: insertError } = await supabase
        .from('citizen_messages')
        .insert([formData]);

      if (insertError) throw insertError;

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        message_type: 'support',
        message: '',
      });
      
      // Refresh messages after successful submission
      setTimeout(() => {
        fetchPublicMessages();
      }, 1000);
    } catch (err) {
      setError(t('citizen.form.error'));
      console.error('Error submitting message:', err);
    } finally {
      setLoading(false);
    }
  };

  const messageTypes = [
    { value: 'support', label: t('citizen.form.types.support'), icon: Heart },
    { value: 'grievance', label: t('citizen.form.types.grievance'), icon: MessageSquare },
    { value: 'idea', label: t('citizen.form.types.idea'), icon: Lightbulb },
    { value: 'question', label: t('citizen.form.types.question'), icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <section className="relative py-20 bg-gradient-to-r from-blue-900 to-green-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">{t('citizen.title')}</h1>
          <p className="text-xl text-blue-100">{t('citizen.subtitle')}</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                {t('citizen.form.success')}
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('citizen.form.name')} *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('citizen.form.email')} *
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
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('citizen.form.phone')}
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {t('citizen.form.type')} *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {messageTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, message_type: type.value })}
                      className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                        formData.message_type === type.value
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <type.icon size={24} className={formData.message === type.value ? 'text-blue-600' : 'text-gray-600'} />
                      <span className="text-xs mt-2 text-center">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('citizen.form.message')} *
                </label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('citizen.form.messagePlaceholder')}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>{loading ? t('citizen.form.submitting') : t('citizen.form.submit')}</span>
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {publicMessages.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('citizen.testimonials.title')}
              </h2>
              <p className="text-lg text-gray-600">
                {t('citizen.testimonials.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publicMessages.map((message) => (
                <div key={message.id} className="bg-white rounded-xl shadow-lg p-6">
                  <Heart className="text-red-600 mb-3" size={24} />
                  <p className="text-gray-700 mb-4 line-clamp-4">{message.message}</p>
                  <p className="text-sm font-semibold text-gray-900">{message.name}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(message.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
