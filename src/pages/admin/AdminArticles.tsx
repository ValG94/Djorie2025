import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import Modal from '../../components/admin/Modal';
import LoadingSpinner from '../../components/admin/LoadingSpinner';
import { Plus, Edit2, Trash2, Eye, EyeOff, FileText, Image as ImageIcon } from 'lucide-react';
import { uploadFile, validateMediaFile, createImagePreview } from '../../lib/supabase-storage';

interface Article {
  id: string;
  title: string;
  title_en: string;
  content: string;
  content_en: string;
  category: string;
  image_url: string | null;
  pdf_url: string | null;
  published: boolean;
  created_at: string;
}

const CATEGORIES = [
  { value: 'all', label: 'Toutes' },
  { value: 'campaign', label: 'Campagne' },
  { value: 'programs', label: 'Programmes' },
  { value: 'declarations', label: 'Déclarations' },
  { value: 'mediation', label: 'Médiation' },
  { value: 'peace2020', label: 'Paix 2020' },
  { value: 'other', label: 'Autre' },
];

export default function AdminArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  
  // Fichiers
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    title_en: '',
    content: '',
    content_en: '',
    category: 'campaign',
    published: true,
  });

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
      alert('Erreur lors du chargement des articles');
    } finally {
      setLoading(false);
    }
  };

  const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Valider que c'est une image
      if (!file.type.startsWith('image/')) {
        throw new Error('Veuillez sélectionner une image (JPG, PNG, WEBP)');
      }
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('L\'image ne doit pas dépasser 5MB');
      }

      setCoverImageFile(file);
      const preview = await createImagePreview(file);
      setCoverImagePreview(preview);
    } catch (error: any) {
      alert(error.message);
      e.target.value = '';
    }
  };

  const handlePDFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Valider que c'est un PDF
      if (file.type !== 'application/pdf') {
        throw new Error('Veuillez sélectionner un fichier PDF');
      }
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('Le PDF ne doit pas dépasser 10MB');
      }

      setPdfFile(file);
    } catch (error: any) {
      alert(error.message);
      e.target.value = '';
    }
  };

  const openModal = (article?: Article) => {
    if (article) {
      setEditingArticle(article);
      setFormData({
        title: article.title,
        title_en: article.title_en,
        content: article.content,
        content_en: article.content_en,
        category: article.category || 'campaign',
        published: article.published,
      });
      setCoverImagePreview(article.image_url);
    } else {
      setEditingArticle(null);
      setFormData({
        title: '',
        title_en: '',
        content: '',
        content_en: '',
        category: 'campaign',
        published: true,
      });
      setCoverImagePreview(null);
    }
    setCoverImageFile(null);
    setPdfFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingArticle(null);
    setCoverImageFile(null);
    setCoverImagePreview(null);
    setPdfFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let imageUrl = editingArticle?.image_url || null;
      let pdfUrl = editingArticle?.pdf_url || null;

      // Upload de l'image de couverture si nouvelle
      if (coverImageFile) {
        imageUrl = await uploadFile(coverImageFile, 'articles');
      }

      // Upload du PDF si nouveau
      if (pdfFile) {
        pdfUrl = await uploadFile(pdfFile, 'articles');
      }

      const articleData = {
        ...formData,
        image_url: imageUrl,
        pdf_url: pdfUrl,
      };

      if (editingArticle) {
        const { error } = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', editingArticle.id);

        if (error) throw error;
        alert('Article mis à jour avec succès !');
      } else {
        const { error } = await supabase
          .from('articles')
          .insert([articleData]);

        if (error) throw error;
        alert('Article créé avec succès !');
      }

      closeModal();
      fetchArticles();
    } catch (error: any) {
      console.error('Error saving article:', error);
      alert('Erreur lors de l\'enregistrement : ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (article: Article) => {
    try {
      const { error } = await supabase
        .from('articles')
        .update({ published: !article.published })
        .eq('id', article.id);

      if (error) throw error;
      fetchArticles();
    } catch (error) {
      console.error('Error toggling published:', error);
      alert('Erreur lors de la modification du statut');
    }
  };

  const deleteArticle = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      alert('Article supprimé avec succès !');
      fetchArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <AdminLayout title="Gestion des Articles">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Gestion des Articles</h2>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Nouvel Article
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">TITRE</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">CATÉGORIE</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">MÉDIA</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">STATUT</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">DATE</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="font-medium text-gray-900">{article.title}</div>
                    <div className="text-sm text-gray-500">{article.title_en}</div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {CATEGORIES.find(c => c.value === article.category)?.label || article.category}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {article.image_url && (
                        <ImageIcon size={18} className="text-green-600" title="Image" />
                      )}
                      {article.pdf_url && (
                        <FileText size={18} className="text-red-600" title="PDF" />
                      )}
                      {!article.image_url && !article.pdf_url && (
                        <span className="text-gray-400 text-sm">Aucun</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      article.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {article.published ? 'Publié' : 'Brouillon'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {new Date(article.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => togglePublished(article)}
                        className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                        title={article.published ? 'Dépublier' : 'Publier'}
                      >
                        {article.published ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      <button
                        onClick={() => openModal(article)}
                        className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                        title="Modifier"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => deleteArticle(article.id)}
                        className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {articles.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Aucun article pour le moment
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingArticle ? 'Modifier l\'article' : 'Nouvel article'}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Catégorie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {CATEGORIES.filter(c => c.value !== 'all').map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Titre FR */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre (Français) *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Titre EN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre (English) *
            </label>
            <input
              type="text"
              value={formData.title_en}
              onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Contenu FR */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contenu (Français) *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Contenu EN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contenu (English) *
            </label>
            <textarea
              value={formData.content_en}
              onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Image de couverture */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image de couverture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {coverImagePreview && (
              <div className="mt-3">
                <img src={coverImagePreview} alt="Aperçu" className="w-full h-48 object-cover rounded-lg" />
              </div>
            )}
            <p className="mt-1 text-sm text-gray-500">JPG, PNG, WEBP (max 5MB)</p>
          </div>

          {/* Fichier PDF */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document PDF (optionnel)
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={handlePDFChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {pdfFile && (
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                <FileText size={16} className="text-red-600" />
                <span>{pdfFile.name}</span>
              </div>
            )}
            {editingArticle?.pdf_url && !pdfFile && (
              <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                <FileText size={16} />
                <span>PDF existant</span>
              </div>
            )}
            <p className="mt-1 text-sm text-gray-500">PDF (max 10MB). Si ajouté, l'image de couverture sera affichée et le PDF sera accessible en prévisualisation.</p>
          </div>

          {/* Publié */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="published" className="text-sm font-medium text-gray-700">
              Publier immédiatement
            </label>
          </div>

          {/* Boutons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={closeModal}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'Enregistrement...' : editingArticle ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}
