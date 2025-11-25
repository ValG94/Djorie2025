import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import LoadingSpinner from '../../components/admin/LoadingSpinner';
import { FileDown, DollarSign, Users, TrendingUp, CheckCircle, XCircle, Search } from 'lucide-react';

interface Donation {
  id: string;
  name: string;
  email: string;
  amount: number;
  currency: string;
  payment_method: string;
  status: 'pending' | 'completed' | 'failed';
  is_verified: boolean;
  message: string | null;
  created_at: string;
}

export default function AdminDonations() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [verifiedFilter, setVerifiedFilter] = useState<string>('all');

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDonations(data || []);
    } catch (error) {
      console.error('Error fetching donations:', error);
      alert('Erreur lors du chargement des dons');
    } finally {
      setLoading(false);
    }
  };

  const toggleVerified = async (donation: Donation) => {
    try {
      const { error } = await supabase
        .from('donations')
        .update({ is_verified: !donation.is_verified })
        .eq('id', donation.id);

      if (error) throw error;
      fetchDonations();
    } catch (error) {
      console.error('Error updating donation:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const exportDonations = () => {
    const csv = [
      ['Date', 'Nom', 'Email', 'Montant', 'Devise', 'Méthode', 'Statut', 'Vérifié', 'Message'],
      ...filteredDonations.map(d => [
        new Date(d.created_at).toLocaleString('fr-FR'),
        d.name,
        d.email,
        d.amount.toString(),
        d.currency,
        d.payment_method,
        d.status,
        d.is_verified ? 'Oui' : 'Non',
        d.message || ''
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dons_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filters
  const filteredDonations = donations.filter(d => {
    const matchesSearch = 
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    const matchesVerified = 
      verifiedFilter === 'all' ||
      (verifiedFilter === 'verified' && d.is_verified) ||
      (verifiedFilter === 'unverified' && !d.is_verified);

    return matchesSearch && matchesStatus && matchesVerified;
  });

  // Statistics
  const stats = {
    total: donations.reduce((sum, d) => d.status === 'completed' ? sum + d.amount : sum, 0),
    count: donations.filter(d => d.status === 'completed').length,
    average: donations.filter(d => d.status === 'completed').length > 0
      ? donations.filter(d => d.status === 'completed').reduce((sum, d) => sum + d.amount, 0) / donations.filter(d => d.status === 'completed').length
      : 0,
    verified: donations.filter(d => d.is_verified).length,
    pending: donations.filter(d => d.status === 'pending').length,
  };

  return (
    <AdminLayout title="Gestion des Dons" description="Suivre et gérer les dons de campagne">
      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-green-700 font-medium">Total collecté</p>
              <DollarSign className="text-green-600" size={24} />
            </div>
            <p className="text-3xl font-bold text-green-900">
              {stats.total.toLocaleString('fr-FR')} FCFA
            </p>
            <p className="text-xs text-green-600 mt-1">Dons complétés uniquement</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-blue-700 font-medium">Nombre de dons</p>
              <Users className="text-blue-600" size={24} />
            </div>
            <p className="text-3xl font-bold text-blue-900">{stats.count}</p>
            <p className="text-xs text-blue-600 mt-1">Donateurs généreux</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-purple-700 font-medium">Don moyen</p>
              <TrendingUp className="text-purple-600" size={24} />
            </div>
            <p className="text-3xl font-bold text-purple-900">
              {Math.round(stats.average).toLocaleString('fr-FR')} FCFA
            </p>
            <p className="text-xs text-purple-600 mt-1">Par donateur</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-orange-700 font-medium">Vérifiés</p>
              <CheckCircle className="text-orange-600" size={24} />
            </div>
            <p className="text-3xl font-bold text-orange-900">{stats.verified}</p>
            <p className="text-xs text-orange-600 mt-1">{stats.pending} en attente</p>
          </div>
        </div>

        {/* Filters and Export */}
        <div className="bg-white border rounded-lg p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher par nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="completed">Complétés</option>
              <option value="pending">En attente</option>
              <option value="failed">Échoués</option>
            </select>

            {/* Verified Filter */}
            <select
              value={verifiedFilter}
              onChange={(e) => setVerifiedFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous</option>
              <option value="verified">Vérifiés</option>
              <option value="unverified">Non vérifiés</option>
            </select>

            {/* Export Button */}
            <button
              onClick={exportDonations}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
            >
              <FileDown size={20} />
              <span>Exporter CSV</span>
            </button>
          </div>
        </div>

        {/* Donations Table */}
        {loading ? (
          <LoadingSpinner />
        ) : filteredDonations.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Aucun don trouvé</p>
          </div>
        ) : (
          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Donateur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Méthode
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vérifié
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDonations.map((donation) => (
                    <tr key={donation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(donation.created_at).toLocaleDateString('fr-FR')}
                        <br />
                        <span className="text-xs text-gray-400">
                          {new Date(donation.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{donation.name}</div>
                        <div className="text-xs text-gray-500">{donation.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">
                          {donation.amount.toLocaleString('fr-FR')} {donation.currency}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {donation.payment_method}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          donation.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : donation.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {donation.status === 'completed' && 'Complété'}
                          {donation.status === 'pending' && 'En attente'}
                          {donation.status === 'failed' && 'Échoué'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {donation.is_verified ? (
                          <CheckCircle className="text-green-600" size={20} />
                        ) : (
                          <XCircle className="text-gray-400" size={20} />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => toggleVerified(donation)}
                          className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                            donation.is_verified
                              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {donation.is_verified ? 'Annuler' : 'Vérifier'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>{filteredDonations.length}</strong> don(s) affiché(s) sur <strong>{donations.length}</strong> au total
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
