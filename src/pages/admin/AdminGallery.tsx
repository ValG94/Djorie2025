import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import Modal from '../../components/admin/Modal';
import LoadingSpinner from '../../components/admin/LoadingSpinner';
import { Plus, Edit2, Trash2, Eye, EyeOff, Image as ImageIcon, Upload } from 'lucide-react';
import { uploadFile, validateImageFile, createImagePreview } from '../../lib/supabase-storage';

interface Album {
  id: string;
  title: string;
  title_en: string;
  description: string;
  description_en: string;
  event_date: string;
  location: string;
  cover_image_url: string | null;
  published: boolean;
  created_at: string;
  photo_count?: number;
}

interface Photo {
  id: string;
  album_id: string;
  image_url: string;
  caption: string;
  caption_en: string;
  order_index: number;
}

export default function AdminGallery() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  const [isPhotosModalOpen, setIsPhotosModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const [albumFormData, setAlbumFormData] = useState({
    title: '',
    title_en: '',
    description: '',
    description_en: '',
    event_date: new Date().toISOString().split('T')[0],
    location: '',
    published: true,
  });

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const { data, error } = await supabase
        .from('photo_albums')
        .select('*')
        .order('event_date', { ascending: false });

      if (error) throw error;

      // Fetch photo counts for each album
      const albumsWithCounts = await Promise.all(
        (data || []).map(async (album) => {
          const { count } = await supabase
            .from('photos')
            .select('*', { count: 'exact', head: true })
            .eq('album_id', album.id);
          return { ...album, photo_count: count || 0 };
        })
      );

      setAlbums(albumsWithCounts);
    } catch (error) {
      console.error('Error fetching albums:', error);
      alert('Erreur lors du chargement des albums');
    } finally {
      setLoading(false);
    }
  };

  const fetchPhotos = async (albumId: string) => {
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('album_id', albumId)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      console.error('Error fetching photos:', error);
      alert('Erreur lors du chargement des photos');
    }
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      validateImageFile(file);
      setCoverFile(file);
      const preview = await createImagePreview(file);
      setCoverPreview(preview);
    } catch (error: any) {
      alert(error.message);
      e.target.value = '';
    }
  };

  const handlePhotosChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      // Validate all files
      files.forEach(file => validateImageFile(file));
      
      setPhotoFiles(files);
      
      // Create previews
      const previews = await Promise.all(
        files.map(file => createImagePreview(file))
      );
      setPhotoPreviews(previews);
    } catch (error: any) {
      alert(error.message);
      e.target.value = '';
    }
  };

  const handleAlbumSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let coverImageUrl = editingAlbum?.cover_image_url || null;

      // Upload cover image if new file selected
      if (coverFile) {
        coverImageUrl = await uploadFile(coverFile, 'gallery', 'covers');
      }

      const albumData = {
        ...albumFormData,
        cover_image_url: coverImageUrl,
      };

      if (editingAlbum) {
        // Update
        const { error } = await supabase
          .from('photo_albums')
          .update(albumData)
          .eq('id', editingAlbum.id);

        if (error) throw error;
        alert('Album modifié avec succès !');
      } else {
        // Create
        const { error } = await supabase
          .from('photo_albums')
          .insert([albumData]);

        if (error) throw error;
        alert('Album créé avec succès !');
      }

      setIsAlbumModalOpen(false);
      resetAlbumForm();
      fetchAlbums();
    } catch (error) {
      console.error('Error saving album:', error);
      alert('Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotosUpload = async () => {
    if (!selectedAlbum || photoFiles.length === 0) return;

    setSaving(true);
    try {
      // Upload all photos
      const uploadPromises = photoFiles.map(async (file, index) => {
        const imageUrl = await uploadFile(file, 'gallery', 'photos');
        return {
          album_id: selectedAlbum.id,
          image_url: imageUrl,
          caption: '',
          caption_en: '',
          order_index: photos.length + index,
        };
      });

      const photoData = await Promise.all(uploadPromises);

      // Insert into database
      const { error } = await supabase
        .from('photos')
        .insert(photoData);

      if (error) throw error;

      alert(`${photoFiles.length} photo(s) ajoutée(s) avec succès !`);
      setPhotoFiles([]);
      setPhotoPreviews([]);
      fetchPhotos(selectedAlbum.id);
      fetchAlbums(); // Refresh counts
    } catch (error) {
      console.error('Error uploading photos:', error);
      alert('Erreur lors de l\'upload des photos');
    } finally {
      setSaving(false);
    }
  };

  const handleEditAlbum = (album: Album) => {
    setEditingAlbum(album);
    setAlbumFormData({
      title: album.title,
      title_en: album.title_en,
      description: album.description,
      description_en: album.description_en,
      event_date: album.event_date,
      location: album.location,
      published: album.published,
    });
    setCoverPreview(album.cover_image_url);
    setIsAlbumModalOpen(true);
  };

  const handleDeleteAlbum = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet album et toutes ses photos ?')) return;

    try {
      // Delete photos first
      const { error: photosError } = await supabase
        .from('photos')
        .delete()
        .eq('album_id', id);

      if (photosError) throw photosError;

      // Delete album
      const { error: albumError } = await supabase
        .from('photo_albums')
        .delete()
        .eq('id', id);

      if (albumError) throw albumError;

      alert('Album supprimé !');
      fetchAlbums();
    } catch (error) {
      console.error('Error deleting album:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm('Supprimer cette photo ?')) return;

    try {
      const { error } = await supabase
        .from('photos')
        .delete()
        .eq('id', photoId);

      if (error) throw error;

      alert('Photo supprimée !');
      if (selectedAlbum) {
        fetchPhotos(selectedAlbum.id);
        fetchAlbums(); // Refresh counts
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const togglePublished = async (album: Album) => {
    try {
      const { error } = await supabase
        .from('photo_albums')
        .update({ published: !album.published })
        .eq('id', album.id);

      if (error) throw error;
      fetchAlbums();
    } catch (error) {
      console.error('Error toggling published:', error);
      alert('Erreur lors de la modification');
    }
  };

  const openPhotosModal = (album: Album) => {
    setSelectedAlbum(album);
    fetchPhotos(album.id);
    setIsPhotosModalOpen(true);
  };

  const resetAlbumForm = () => {
    setAlbumFormData({
      title: '',
      title_en: '',
      description: '',
      description_en: '',
      event_date: new Date().toISOString().split('T')[0],
      location: '',
      published: true,
    });
    setEditingAlbum(null);
    setCoverFile(null);
    setCoverPreview(null);
  };

  const openCreateModal = () => {
    resetAlbumForm();
    setIsAlbumModalOpen(true);
  };

  return (
    <AdminLayout title="Gestion de la Galerie" description="Créer et gérer les albums photo">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Albums Photo</h2>
            <p className="text-gray-600 mt-1">{albums.length} album(s) au total</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>Nouvel album</span>
          </button>
        </div>

        {/* Albums Grid */}
        {loading ? (
          <LoadingSpinner />
        ) : albums.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Aucun album pour le moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album) => (
              <div key={album.id} className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                {album.cover_image_url && (
                  <img
                    src={album.cover_image_url}
                    alt={album.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                {!album.cover_image_url && (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <ImageIcon size={48} className="text-gray-400" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{album.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">{album.title_en}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                    <span>📍 {album.location}</span>
                    <span>📅 {new Date(album.event_date).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <ImageIcon size={16} />
                    <span>{album.photo_count || 0} photo(s)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openPhotosModal(album)}
                      className="flex-1 px-3 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
                    >
                      Voir photos
                    </button>
                    <button
                      onClick={() => togglePublished(album)}
                      className={`p-2 rounded-lg transition-colors ${
                        album.published
                          ? 'bg-green-100 text-green-600 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title={album.published ? 'Publié' : 'Brouillon'}
                    >
                      {album.published ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                    <button
                      onClick={() => handleEditAlbum(album)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteAlbum(album.id)}
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

      {/* Modal Create/Edit Album */}
      <Modal
        isOpen={isAlbumModalOpen}
        onClose={() => setIsAlbumModalOpen(false)}
        title={editingAlbum ? 'Modifier l\'album' : 'Nouvel album'}
        size="lg"
      >
        <form onSubmit={handleAlbumSubmit} className="space-y-6">
          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image de couverture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {coverPreview && (
              <img src={coverPreview} alt="Preview" className="mt-4 w-full h-48 object-cover rounded-lg" />
            )}
          </div>

          {/* Title FR */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre (Français) *
            </label>
            <input
              type="text"
              required
              value={albumFormData.title}
              onChange={(e) => setAlbumFormData({ ...albumFormData, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Title EN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre (English) *
            </label>
            <input
              type="text"
              required
              value={albumFormData.title_en}
              onChange={(e) => setAlbumFormData({ ...albumFormData, title_en: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Description FR */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Français)
            </label>
            <textarea
              rows={3}
              value={albumFormData.description}
              onChange={(e) => setAlbumFormData({ ...albumFormData, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Description EN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (English)
            </label>
            <textarea
              rows={3}
              value={albumFormData.description_en}
              onChange={(e) => setAlbumFormData({ ...albumFormData, description_en: e.target.value })}
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
              value={albumFormData.location}
              onChange={(e) => setAlbumFormData({ ...albumFormData, location: e.target.value })}
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
              value={albumFormData.event_date}
              onChange={(e) => setAlbumFormData({ ...albumFormData, event_date: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Published */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="published"
              checked={albumFormData.published}
              onChange={(e) => setAlbumFormData({ ...albumFormData, published: e.target.checked })}
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
              onClick={() => setIsAlbumModalOpen(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'Enregistrement...' : editingAlbum ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Photos */}
      <Modal
        isOpen={isPhotosModalOpen}
        onClose={() => setIsPhotosModalOpen(false)}
        title={`Photos - ${selectedAlbum?.title}`}
        size="xl"
      >
        <div className="space-y-6">
          {/* Upload Section */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Upload size={20} className="inline mr-2" />
              Ajouter des photos (sélection multiple)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotosChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {photoPreviews.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">{photoPreviews.length} photo(s) sélectionnée(s)</p>
                <div className="grid grid-cols-3 gap-2">
                  {photoPreviews.map((preview, index) => (
                    <img key={index} src={preview} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded" />
                  ))}
                </div>
                <button
                  onClick={handlePhotosUpload}
                  disabled={saving}
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Upload en cours...' : `Uploader ${photoPreviews.length} photo(s)`}
                </button>
              </div>
            )}
          </div>

          {/* Photos Grid */}
          {photos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucune photo dans cet album
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <img
                    src={photo.image_url}
                    alt={photo.caption || 'Photo'}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </AdminLayout>
  );
}
