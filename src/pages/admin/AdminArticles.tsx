import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import Modal from '../../components/admin/Modal';
import LoadingSpinner from '../../components/admin/LoadingSpinner';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { uploadFile, validateImageFile, createImagePreview } from '../../lib/supabase-storage';

interface Article {
  id: string;
  title: string;
  title_en: string;
  content: string;
  content_en: string;
  image_url: string | null;
  published: boolean;
  created_at: string;
}

export default function AdminArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    title_en: '',
    content: '',
    content_en: '',
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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      validateImageFile(file);
      setImageFile(file);
      const preview = await createImagePreview(file);
      setImagePreview(preview);
    } catch (error: any) {
      alert(error.message);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let imageUrl = editingArticle?.image_url || null;

      // Upload image if new file selected
      if (imageFile) {
        imageUrl = await uploadFile(imageFile, 'articles');
      }

      const articleData = {
        ...formData,
        image_url: imageUrl,
      };

      if (editingArticle) {
        // Update
        const { error } = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', editingArticle.id);

        if (error) throw error;
        alert('Article modifié avec succès !');
      } else {
        // Create
        const { error } = await supabase
          .from('articles')
          .insert([articleData]);

        if (error) throw error;
        alert('Article créé avec succès !');
      }

      setIsModalOpen(false);
      resetForm();
      fetchArticles();
    } catch (error) {
      console.error('Error saving article:', error);
      alert('Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      title_en: article.title_en,
      content: article.content,
      content_en: article.content_en,
      published: article.published,
    });
    setImagePreview(article.image_url);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      alert('Article supprimé !');
      fetchArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Erreur lors de la suppression');
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
      alert('Erreur lors de la modification');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      title_en: '',
      content: '',
      content_en: '',
      published: true,
    });
    setEditingArticle(null);
    setImageFile(null);
    setImagePreview(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  return (
    <AdminLayout title="Gestion des Actualités" description="Créer et gérer les articles">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Articles</h2>
            <p className="text-gray-600 mt-1">{articles.length} article(s) au total</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>Nouvel article</span>
          </button>
        </div>

        {/* Articles List */}
        {loading ? (
          <LoadingSpinner />
        ) : articles.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Aucun article pour le moment</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {articles.map((article) => (
              <div key={article.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  {article.image_url && (
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{article.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{article.title_en}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(article.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => togglePublished(article)}
                          className={`p-2 rounded-lg transition-colors ${
                            article.published
                              ? 'bg-green-100 text-green-600 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          title={article.published ? 'Publié' : 'Brouillon'}
                        >
                          {article.published ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                        <button
                          onClick={() => handleEdit(article)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Create/Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingArticle ? 'Modifier l\'article' : 'Nouvel article'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image de couverture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="mt-4 w-full h-48 object-cover rounded-lg" />
            )}
          </div>

          {/* Titre FR */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre (Français) *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Titre EN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre (English) *
            </label>
            <input
              type="text"
              required
              value={formData.title_en}
              onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Contenu FR */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contenu (Français) *
            </label>
            <textarea
              required
              rows={8}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Contenu EN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contenu (English) *
            </label>
            <textarea
              required
              rows={8}
              value={formData.content_en}
              onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Published */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="published" className="ml-2 text-sm text-gray-700">
              Publier immédiatement
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'Enregistrement...' : editingArticle ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}
