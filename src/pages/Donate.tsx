import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CreditCard, Smartphone, Building2, Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Donate() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    donor_name: '',
    email: '',
    phone: '',
    amount: '',
    payment_method: 'mobile_money',
    payment_provider: 'orange_money',
    is_anonymous: false,
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const { error: insertError } = await supabase
        .from('donations')
        .insert([{
          ...formData,
          amount: parseFloat(formData.amount),
          currency: 'XAF',
          status: 'pending',
        }]);

      if (insertError) throw insertError;

      setSuccess(true);
      setFormData({
        donor_name: '',
        email: '',
        phone: '',
        amount: '',
        payment_method: 'mobile_money',
        payment_provider: 'orange_money',
        is_anonymous: false,
        message: '',
      });
    } catch (err) {
      setError(t('donate.form.error'));
      console.error('Error submitting donation:', err);
    } finally {
      setLoading(false);
    }
  };

  const suggestedAmounts = [5000, 10000, 25000, 50000, 100000];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <section className="relative py-20 bg-gradient-to-r from-green-900 via-blue-900 to-red-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">{t('donate.title')}</h1>
          <p className="text-xl text-green-100">{t('donate.subtitle')}</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 flex items-center space-x-2">
                <Heart className="text-green-600" />
                <span>{t('donate.form.success')}</span>
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
                  <label htmlFor="donor_name" className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('donate.form.name')} *
                  </label>
                  <input
                    type="text"
                    id="donor_name"
                    required
                    value={formData.donor_name}
                    onChange={(e) => setFormData({ ...formData, donor_name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('donate.form.email')} *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('donate.form.phone')} *
                </label>
                <input
                  type="tel"
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('donate.form.amount')} *
                </label>
                <input
                  type="number"
                  id="amount"
                  required
                  min="1000"
                  step="100"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  {suggestedAmounts.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setFormData({ ...formData, amount: amount.toString() })}
                      className="px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-semibold"
                    >
                      {amount.toLocaleString()} XAF
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {t('donate.form.paymentMethod')} *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, payment_method: 'mobile_money' })}
                    className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                      formData.payment_method === 'mobile_money'
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <Smartphone size={32} className={formData.payment_method === 'mobile_money' ? 'text-green-600' : 'text-gray-600'} />
                    <span className="text-sm mt-2 font-medium">{t('donate.form.methods.mobile_money')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, payment_method: 'card' })}
                    className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                      formData.payment_method === 'card'
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <CreditCard size={32} className={formData.payment_method === 'card' ? 'text-green-600' : 'text-gray-600'} />
                    <span className="text-sm mt-2 font-medium">{t('donate.form.methods.card')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, payment_method: 'bank_transfer' })}
                    className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                      formData.payment_method === 'bank_transfer'
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <Building2 size={32} className={formData.payment_method === 'bank_transfer' ? 'text-green-600' : 'text-gray-600'} />
                    <span className="text-sm mt-2 font-medium">{t('donate.form.methods.bank_transfer')}</span>
                  </button>
                </div>
              </div>

              {formData.payment_method === 'mobile_money' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {t('donate.form.provider')} *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, payment_provider: 'orange_money' })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.payment_provider === 'orange_money'
                          ? 'border-orange-600 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <span className="font-semibold text-orange-600">Orange Money</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, payment_provider: 'moov_money' })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.payment_provider === 'moov_money'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <span className="font-semibold text-blue-600">Moov Money</span>
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('donate.form.message')}
                </label>
                <textarea
                  id="message"
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_anonymous"
                  checked={formData.is_anonymous}
                  onChange={(e) => setFormData({ ...formData, is_anonymous: e.target.checked })}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor="is_anonymous" className="ml-2 text-sm text-gray-700">
                  {t('donate.form.anonymous')}
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Heart size={20} />
                <span>{loading ? t('donate.form.submitting') : t('donate.form.submit')}</span>
              </button>
            </form>
          </div>

          {formData.payment_method === 'bank_transfer' && (
            <div className="mt-8 bg-blue-50 rounded-xl p-8">
              <h3 className="text-xl font-bold text-blue-900 mb-4">
                {t('donate.info.title')}
              </h3>
              <p className="text-sm text-blue-700 mb-4">
                {t('donate.info.subtitle')}
              </p>
              <div className="space-y-2 text-sm">
                <p><span className="font-semibold">Banque:</span> BGFI Bank Centrafrique</p>
                <p><span className="font-semibold">Numéro de compte:</span> 12345678901234</p>
                <p><span className="font-semibold">Code SWIFT:</span> BGFICFCX</p>
                <p><span className="font-semibold">Référence:</span> DJORIE2025</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
