import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import Modal from '../../components/admin/Modal';
import LoadingSpinner from '../../components/admin/LoadingSpinner';
import { Plus, Edit2, Trash2, Send, Mail, Users, FileDown, Eye } from 'lucide-react';

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  subscribed_at: string;
  is_active: boolean;
}

interface Template {
  id: string;
  name: string;
  subject: string;
  content: string;
  created_at: string;
}

interface Campaign {
  id: string;
  template_id: string;
  subject: string;
  sent_at: string;
  recipient_count: number;
  status: 'draft' | 'sent';
}

export default function AdminNewsletter() {
  const [activeTab, setActiveTab] = useState<'subscribers' | 'templates' | 'campaigns'>('subscribers');
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [templateFormData, setTemplateFormData] = useState({
    name: '',
    subject: '',
    content: '',
  });

  useEffect(() => {
    fetchSubscribers();
    fetchTemplates();
    fetchCampaigns();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });

      if (error) throw error;
      setSubscribers(data || []);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('newsletter_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('newsletter_campaigns')
        .select('*')
        .order('sent_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  const handleTemplateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingTemplate) {
        // Update
        const { error } = await supabase
          .from('newsletter_templates')
          .update(templateFormData)
          .eq('id', editingTemplate.id);

        if (error) throw error;
        alert('Template modifié avec succès !');
      } else {
        // Create
        const { error } = await supabase
          .from('newsletter_templates')
          .insert([templateFormData]);

        if (error) throw error;
        alert('Template créé avec succès !');
      }

      setIsTemplateModalOpen(false);
      resetTemplateForm();
      fetchTemplates();
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
    }
  };

  const handleSendCampaign = async () => {
    if (!selectedTemplate) return;

    setSaving(true);
    try {
      const activeSubscribers = subscribers.filter(s => s.is_active);

      if (activeSubscribers.length === 0) {
        alert('Aucun abonné actif à qui envoyer la newsletter');
        return;
      }

      // Create campaign record
      const { error: campaignError } = await supabase
        .from('newsletter_campaigns')
        .insert([{
          template_id: selectedTemplate.id,
          subject: selectedTemplate.subject,
          recipient_count: activeSubscribers.length,
          status: 'sent',
          sent_at: new Date().toISOString(),
        }]);

      if (campaignError) throw campaignError;

      // Note: Pour envoyer les emails réels, vous devez configurer un service d'envoi
      // comme SendGrid, Resend, ou utiliser Supabase Edge Functions
      console.log('Sending to:', activeSubscribers.length, 'subscribers');
      console.log('Subject:', selectedTemplate.subject);
      console.log('Content:', selectedTemplate.content);

      alert(`Newsletter envoyée avec succès à ${activeSubscribers.length} abonné(s) ! (Simulation)`);
      setIsSendModalOpen(false);
      setSelectedTemplate(null);
      fetchCampaigns();
    } catch (error) {
      console.error('Error sending campaign:', error);
      alert('Erreur lors de l\'envoi');
    } finally {
      setSaving(false);
    }
  };

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template);
    setTemplateFormData({
      name: template.name,
      subject: template.subject,
      content: template.content,
    });
    setIsTemplateModalOpen(true);
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm('Supprimer ce template ?')) return;

    try {
      const { error } = await supabase
        .from('newsletter_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      alert('Template supprimé !');
      fetchTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleUnsubscribe = async (id: string) => {
    if (!confirm('Désabonner cet utilisateur ?')) return;

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
      alert('Utilisateur désabonné !');
      fetchSubscribers();
    } catch (error) {
      console.error('Error unsubscribing:', error);
      alert('Erreur lors de la désabonnement');
    }
  };

  const exportSubscribers = () => {
    const activeSubscribers = subscribers.filter(s => s.is_active);
    const csv = [
      ['Email', 'Nom', 'Date d\'inscription'],
      ...activeSubscribers.map(s => [
        s.email,
        s.name || '',
        new Date(s.subscribed_at).toLocaleDateString('fr-FR')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `abonnes_newsletter_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetTemplateForm = () => {
    setTemplateFormData({
      name: '',
      subject: '',
      content: '',
    });
    setEditingTemplate(null);
  };

  const openSendModal = (template: Template) => {
    setSelectedTemplate(template);
    setIsSendModalOpen(true);
  };

  const filteredSubscribers = subscribers.filter(s =>
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.name && s.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const stats = {
    total: subscribers.length,
    active: subscribers.filter(s => s.is_active).length,
    templates: templates.length,
    campaigns: campaigns.length,
  };

  return (
    <AdminLayout title="Gestion de la Newsletter" description="Gérer les abonnés et envoyer des campagnes">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-600 font-medium">Abonnés actifs</p>
            <p className="text-2xl font-bold text-blue-900">{stats.active}</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 font-medium">Total abonnés</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-600 font-medium">Templates</p>
            <p className="text-2xl font-bold text-purple-900">{stats.templates}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-600 font-medium">Campagnes envoyées</p>
            <p className="text-2xl font-bold text-green-900">{stats.campaigns}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-8">
            {(['subscribers', 'templates', 'campaigns'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab === 'subscribers' && 'Abonnés'}
                {tab === 'templates' && 'Templates'}
                {tab === 'campaigns' && 'Campagnes'}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* Subscribers Tab */}
            {activeTab === 'subscribers' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <input
                    type="text"
                    placeholder="Rechercher un abonné..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={exportSubscribers}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <FileDown size={20} />
                    <span>Exporter CSV</span>
                  </button>
                </div>

                {filteredSubscribers.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">Aucun abonné</p>
                  </div>
                ) : (
                  <div className="bg-white border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredSubscribers.map((subscriber) => (
                          <tr key={subscriber.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{subscriber.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{subscriber.name || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(subscriber.subscribed_at).toLocaleDateString('fr-FR')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                subscriber.is_active
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {subscriber.is_active ? 'Actif' : 'Désabonné'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {subscriber.is_active && (
                                <button
                                  onClick={() => handleUnsubscribe(subscriber.id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  Désabonner
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Templates Tab */}
            {activeTab === 'templates' && (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      resetTemplateForm();
                      setIsTemplateModalOpen(true);
                    }}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={20} />
                    <span>Nouveau template</span>
                  </button>
                </div>

                {templates.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">Aucun template</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {templates.map((template) => (
                      <div key={template.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-900">{template.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">Objet: {template.subject}</p>
                            <p className="text-xs text-gray-400 mt-2">
                              Créé le {new Date(template.created_at).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openSendModal(template)}
                              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                              title="Envoyer"
                            >
                              <Send size={18} />
                            </button>
                            <button
                              onClick={() => handleEditTemplate(template)}
                              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteTemplate(template.id)}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Campaigns Tab */}
            {activeTab === 'campaigns' && (
              <div className="space-y-4">
                {campaigns.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">Aucune campagne envoyée</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {campaigns.map((campaign) => (
                      <div key={campaign.id} className="bg-white border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-gray-900">{campaign.subject}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              Envoyée à {campaign.recipient_count} abonné(s)
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(campaign.sent_at).toLocaleString('fr-FR')}
                            </p>
                          </div>
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                            Envoyée
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal Template */}
      <Modal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        title={editingTemplate ? 'Modifier le template' : 'Nouveau template'}
        size="lg"
      >
        <form onSubmit={handleTemplateSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du template *
            </label>
            <input
              type="text"
              required
              value={templateFormData.name}
              onChange={(e) => setTemplateFormData({ ...templateFormData, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Newsletter mensuelle"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Objet de l'email *
            </label>
            <input
              type="text"
              required
              value={templateFormData.subject}
              onChange={(e) => setTemplateFormData({ ...templateFormData, subject: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Actualités de la campagne - Novembre 2025"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contenu de l'email *
            </label>
            <textarea
              required
              rows={12}
              value={templateFormData.content}
              onChange={(e) => setTemplateFormData({ ...templateFormData, content: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              placeholder="Contenu HTML de l'email..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Vous pouvez utiliser du HTML pour la mise en forme
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setIsTemplateModalOpen(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'Enregistrement...' : editingTemplate ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Send Campaign */}
      <Modal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        title="Envoyer une campagne"
        size="md"
      >
        {selectedTemplate && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">
                <Mail className="inline mr-2" size={20} />
                {selectedTemplate.name}
              </h3>
              <p className="text-sm text-blue-800">
                <strong>Objet:</strong> {selectedTemplate.subject}
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <Users className="inline mr-2" size={16} />
                Cette campagne sera envoyée à <strong>{stats.active} abonné(s) actif(s)</strong>
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-900">
                ⚠️ <strong>Note:</strong> L'envoi d'emails nécessite la configuration d'un service d'envoi (SendGrid, Resend, etc.). 
                Pour l'instant, ceci est une simulation.
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => setIsSendModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSendCampaign}
                disabled={saving}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Envoi...' : 'Envoyer maintenant'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}
