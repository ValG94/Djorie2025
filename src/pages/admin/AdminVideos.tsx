import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import Modal from '../../components/admin/Modal';
import LoadingSpinner from '../../components/admin/LoadingSpinner';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { uploadFile, validateImageFile, createImagePreview } from '../../lib/supabase-storage';

interface Video {
  id: string;
  title: string;
  title_en: string;
  description: string;
  description_en: string;
  video_url: string;
  thumbnail_url: string | null;
  location: string;
  tags: string[];
  duration: number;
  event_date: string;
  views: number;
  published: boolean;
  created_at: string;
}

export default function AdminVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    title_en: '',
    description: '',
    description_en: '',
    video_url: '',
    location: '',
    tags: '',
    event_date: new Date().toISOString().split('T')[0],
    published: true,
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
      alert('Erreur lors du chargement des vidéos');
    } finally {
      setLoading(false);
    }
  };

  const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      validateImageFile(file);
      setThumbnailFile(file);
      const preview = await createImagePreview(file);
      setThumbnailPreview(preview);
    } catch (error: any) {
      alert(error.message);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let thumbnailUrl = editingVideo?.thumbnail_url || null;

      // Upload thumbnail if new file selected
      if (thumbnailFile) {
        thumbnailUrl = await uploadFile(thumbnailFile, 'videos', 'thumbnails');
      }

      const videoData = {
        title: formData.title,
        title_en: formData.title_en,
        description: formData.description,
        description_en: formData.description_en,
        video_url: formData.video_url,
        thumbnail_url: thumbnailUrl,
        location: formData.location,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        event_date: formData.event_date,
        published: formData.published,
      };

      if (editingVideo) {
        // Update
        const { error } = await supabase
          .from('videos')
          .update(videoData)
          .eq('id', editingVideo.id);

        if (error) throw error;
        alert('Vidéo modifiée avec succès !');
      } else {
        // Create
        const { error } = await supabase
          .from('videos')
          .insert([videoData]);

        if (error) throw error;
        alert('Vidéo créée avec succès !');
      }

      setIsModalOpen(false);
      resetForm();
      fetchVideos();
    } catch (error) {
      console.error('Error saving video:', error);
      alert('Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (video: Video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      title_en: video.title_en,
      description: video.description,
      description_en: video.description_en,
      video_url: video.video_url,
      location: video.location,
      tags: video.tags.join(', '),
      event_date: video.event_date,
      published: video.published,
    });
    setThumbnailPreview(video.thumbnail_url);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette vidéo ?')) return;

    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      alert('Vidéo supprimée !');
      fetchVideos();
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const togglePublished = async (video: Video) => {
    try {
      const { error } = await supabase
        .from('videos')
        .update({ published: !video.published })
        .eq('id', video.id);

      if (error) throw error;
      fetchVideos();
    } catch (error) {
      console.error('Error toggling published:', error);
      alert('Erreur lors de la modification');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      title_en: '',
      description: '',
      description_en: '',
      video_url: '',
      location: '',
      tags: '',
      event_date: new Date().toISOString().split('T')[0],
      published: true,
    });
    setEditingVideo(null);
    setThumbnailFile(null);
    setThumbnailPreview(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  return (
    <AdminLayout title="Gestion des Vidéos" description="Créer et gérer les vidéos">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Vidéos</h2>
            <p className="text-gray-600 mt-1">{videos.length} vidéo(s) au total</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>Nouvelle vidéo</span>
          </button>
        </div>

        {/* Videos List */}
        {loading ? (
          <LoadingSpinner />
        ) : videos.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Aucune vidéo pour le moment</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {videos.map((video) => (
              <div key={video.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  {video.thumbnail_url && (
                    <img
                      src={video.thumbnail_url}
                      alt={video.title}
                      className="w-32 h-20 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{video.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{video.title_en}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                          <span>📍 {video.location}</span>
                          <span>👁️ {video.views} vues</span>
                          <span>{new Date(video.event_date).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => togglePublished(video)}
                          className={`p-2 rounded-lg transition-colors ${
                            video.published
                              ? 'bg-green-100 text-green-600 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          title={video.published ? 'Publié' : 'Brouillon'}
                        >
                          {video.published ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                        <button
                          onClick={() => handleEdit(video)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(video.id)}
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
        title={editingVideo ? 'Modifier la vidéo' : 'Nouvelle vidéo'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* URL YouTube */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL YouTube *
            </label>
            <input
              type="url"
              required
              placeholder="https://www.youtube.com/watch?v=..."
              value={formData.video_url}
              onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Miniature (thumbnail)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {thumbnailPreview && (
              <img src={thumbnailPreview} alt="Preview" className="mt-4 w-full h-40 object-cover rounded-lg" />
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

          {/* Description FR */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Français) *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Description EN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (English) *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description_en}
              onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lieu *
            </label>
            <input
              type="text"
              required
              placeholder="Bangui, République Centrafricaine"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (séparés par des virgules)
            </label>
            <input
              type="text"
              placeholder="Candidature, Présidentielle 2025, Déclaration"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Event Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date de l'événement *
            </label>
            <input
              type="date"
              required
              value={formData.event_date}
              onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
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
              {saving ? 'Enregistrement...' : editingVideo ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}
