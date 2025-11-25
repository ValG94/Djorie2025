import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import Modal from '../../components/admin/Modal';
import LoadingSpinner from '../../components/admin/LoadingSpinner';
import { CheckCircle, XCircle, Trash2, Mail, Eye } from 'lucide-react';

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  message_type: string;
  status: 'pending' | 'approved' | 'rejected';
  is_read: boolean;
  created_at: string;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('citizen_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      alert('Erreur lors du chargement des messages');
    } finally {
      setLoading(false);
    }
  };

  const updateMessageStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('citizen_messages')
        .update({ status, is_read: true })
        .eq('id', id);

      if (error) throw error;
      alert(status === 'approved' ? 'Message approuvé !' : 'Message rejeté !');
      fetchMessages();
    } catch (error) {
      console.error('Error updating message:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('citizen_messages')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;
      fetchMessages();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) return;

    try {
      const { error } = await supabase
        .from('citizen_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      alert('Message supprimé !');
      fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const openDetail = (message: Message) => {
    setSelectedMessage(message);
    setIsDetailModalOpen(true);
    if (!message.is_read) {
      markAsRead(message.id);
    }
  };

  const openReply = (message: Message) => {
    setSelectedMessage(message);
    setReplyText(`Bonjour ${message.name},\n\nMerci pour votre message.\n\n`);
    setIsReplyModalOpen(true);
  };

  const handleSendReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;

    setSending(true);
    try {
      // Note: Pour envoyer un email, vous devrez configurer un service d'envoi d'emails
      // comme SendGrid, Resend, ou utiliser Supabase Edge Functions
      // Pour l'instant, on simule l'envoi
      
      console.log('Sending email to:', selectedMessage.email);
      console.log('Reply:', replyText);

      // TODO: Implémenter l'envoi d'email réel
      // Exemple avec une Edge Function Supabase:
      // const { error } = await supabase.functions.invoke('send-email', {
      //   body: {
      //     to: selectedMessage.email,
      //     subject: 'Réponse à votre message',
      //     text: replyText,
      //   },
      // });

      alert('Réponse envoyée avec succès ! (Simulation)');
      setIsReplyModalOpen(false);
      setReplyText('');
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Erreur lors de l\'envoi');
    } finally {
      setSending(false);
    }
  };

  const filteredMessages = messages.filter(msg => {
    if (filter === 'all') return true;
    return msg.status === filter;
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    const labels = {
      pending: 'En attente',
      approved: 'Approuvé',
      rejected: 'Rejeté',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const stats = {
    total: messages.length,
    pending: messages.filter(m => m.status === 'pending').length,
    approved: messages.filter(m => m.status === 'approved').length,
    rejected: messages.filter(m => m.status === 'rejected').length,
  };

  return (
    <AdminLayout title="Gestion des Messages Citoyens" description="Modérer et répondre aux messages">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-600 font-medium">Total</p>
            <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-600 font-medium">En attente</p>
            <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-600 font-medium">Approuvés</p>
            <p className="text-2xl font-bold text-green-900">{stats.approved}</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600 font-medium">Rejetés</p>
            <p className="text-2xl font-bold text-red-900">{stats.rejected}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f === 'all' ? 'Tous' : f === 'pending' ? 'En attente' : f === 'approved' ? 'Approuvés' : 'Rejetés'}
            </button>
          ))}
        </div>

        {/* Messages List */}
        {loading ? (
          <LoadingSpinner />
        ) : filteredMessages.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Aucun message</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                className={`bg-white border rounded-lg p-4 hover:shadow-md transition-shadow ${
                  !message.is_read ? 'border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-gray-900">{message.name}</h3>
                      {getStatusBadge(message.status)}
                      {!message.is_read && (
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-semibold">
                          Nouveau
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      📧 {message.email} {message.phone && `• 📞 ${message.phone}`}
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      Type: {message.message_type} • {new Date(message.created_at).toLocaleDateString('fr-FR')}
                    </p>
                    <p className="text-gray-700 line-clamp-2">{message.message}</p>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => openDetail(message)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                      title="Voir détails"
                    >
                      <Eye size={18} />
                    </button>
                    {message.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateMessageStatus(message.id, 'approved')}
                          className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                          title="Approuver"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button
                          onClick={() => updateMessageStatus(message.id, 'rejected')}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                          title="Rejeter"
                        >
                          <XCircle size={18} />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => openReply(message)}
                      className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                      title="Répondre"
                    >
                      <Mail size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(message.id)}
                      className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                      title="Supprimer"
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

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Détails du message"
        size="md"
      >
        {selectedMessage && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Nom</p>
              <p className="text-gray-900">{selectedMessage.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Email</p>
              <p className="text-gray-900">{selectedMessage.email}</p>
            </div>
            {selectedMessage.phone && (
              <div>
                <p className="text-sm font-medium text-gray-700">Téléphone</p>
                <p className="text-gray-900">{selectedMessage.phone}</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-700">Type de message</p>
              <p className="text-gray-900">{selectedMessage.message_type}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Statut</p>
              <div className="mt-1">{getStatusBadge(selectedMessage.status)}</div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Date</p>
              <p className="text-gray-900">
                {new Date(selectedMessage.created_at).toLocaleString('fr-FR')}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Message</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-900 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Reply Modal */}
      <Modal
        isOpen={isReplyModalOpen}
        onClose={() => setIsReplyModalOpen(false)}
        title="Répondre au message"
        size="md"
      >
        {selectedMessage && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>À:</strong> {selectedMessage.name} ({selectedMessage.email})
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Votre réponse
              </label>
              <textarea
                rows={10}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Écrivez votre réponse..."
              />
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
                onClick={() => setIsReplyModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSendReply}
                disabled={sending || !replyText.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {sending ? 'Envoi...' : 'Envoyer'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}
