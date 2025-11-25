import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import PhotoLightbox from '../components/PhotoLightbox';

interface Article {
  id: string;
  title: string;
  title_en: string;
  excerpt: string;
  excerpt_en: string;
  image_url: string | null;
  category: string;
  published_at: string;
}

interface Album {
  id: string;
  title: string;
  title_en: string;
  description: string | null;
  description_en: string | null;
  event_date: string;
  location: string;
  cover_image_url: string | null;
  photo_count?: number;
}

interface Photo {
  id: string;
  image_url: string;
  caption: string | null;
  caption_en: string | null;
}

export default function News() {
  const { t, i18n } = useTranslation();
  const [articles, setArticles] = useState<Article[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [loadingAlbums, setLoadingAlbums] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState<'articles' | 'gallery'>('articles');
  
  // Lightbox state
  const [lightboxPhotos, setLightboxPhotos] = useState<Photo[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  const categories = ['all', 'Campagne', 'Programmes', 'Déclarations', 'Médiation', 'Paix 2020', 'Autre'];

  useEffect(() => {
    fetchArticles();
    fetchAlbums();
  }, [selectedCategory]);

  const fetchArticles = async () => {
    setLoadingArticles(true);
    try {
      let query = supabase
        .from('articles')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false })
        .limit(12);

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoadingArticles(false);
    }
  };

  const fetchAlbums = async () => {
    setLoadingAlbums(true);
    try {
      const { data: albumsData, error: albumsError } = await supabase
        .from('photo_albums')
        .select('*')
        .eq('published', true)
        .order('event_date', { ascending: false });

      if (albumsError) throw albumsError;

      // Compter les photos pour chaque album
      const albumsWithCount = await Promise.all(
        (albumsData || []).map(async (album) => {
          const { count } = await supabase
            .from('photos')
            .select('*', { count: 'exact', head: true })
            .eq('album_id', album.id);

          return {
            ...album,
            photo_count: count || 0,
          };
        })
      );

      setAlbums(albumsWithCount);
    } catch (error) {
      console.error('Error fetching albums:', error);
    } finally {
      setLoadingAlbums(false);
    }
  };

  const openAlbum = async (albumId: string) => {
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('album_id', albumId)
        .order('order_index', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        setLightboxPhotos(data);
        setLightboxIndex(0);
        setShowLightbox(true);
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section avec photo */}
      <section className="relative h-[400px] bg-gray-900">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/djorie-news-hero.jpeg)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-green-900/80 to-yellow-900/70" />
        </div>
        
        <div className="relative h-full flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 animate-fade-in-up">
              {t('news.title')}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 animate-fade-in-up animation-delay-200">
              {t('news.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <section className="bg-white shadow-md sticky top-20 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 border-b">
            <button
              onClick={() => setActiveTab('articles')}
              className={`py-4 px-2 font-semibold transition-colors relative ${
                activeTab === 'articles'
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              📰 {t('news.tabs.articles')}
              {activeTab === 'articles' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`py-4 px-2 font-semibold transition-colors relative ${
                activeTab === 'gallery'
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              📸 {t('news.tabs.gallery')}
              {activeTab === 'gallery' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600" />
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Section Actualités */}
      {activeTab === 'articles' && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Filtres par catégorie */}
            <div className="flex flex-wrap gap-3 mb-8 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-semibold transition-all ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-blue-50 shadow'
                  }`}
                >
                  {t(`news.categories.${category}`)}
                </button>
              ))}
            </div>

            {/* Liste des articles */}
            {loadingArticles ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                <p className="text-lg">{t('news.noArticles')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article) => {
                  const title = i18n.language === 'en' ? article.title_en : article.title;
                  const excerpt = i18n.language === 'en' ? article.excerpt_en : article.excerpt;

                  return (
                    <div
                      key={article.id}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer"
                    >
                      {article.image_url && (
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={article.image_url}
                            alt={title}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                            {article.category}
                          </span>
                          <span className="flex items-center text-xs text-gray-500">
                            <Calendar size={14} className="mr-1" />
                            {new Date(article.published_at).toLocaleDateString(
                              i18n.language === 'en' ? 'en-US' : 'fr-FR'
                            )}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                          {title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {excerpt}
                        </p>
                        <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                          {t('news.readMore')} →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Section Galerie Photos */}
      {activeTab === 'gallery' && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('news.gallery.title')}
              </h2>
              <p className="text-lg text-gray-600">
                {t('news.gallery.subtitle')}
              </p>
            </div>

            {/* Liste des albums */}
            {loadingAlbums ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
              </div>
            ) : albums.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                <ImageIcon size={64} className="mx-auto mb-4 text-gray-400" />
                <p className="text-lg">{t('news.gallery.noAlbums')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {albums.map((album) => {
                  const title = i18n.language === 'en' ? album.title_en : album.title;
                  const description = i18n.language === 'en' ? album.description_en : album.description;

                  return (
                    <div
                      key={album.id}
                      onClick={() => openAlbum(album.id)}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer group"
                    >
                      {/* Image de couverture */}
                      <div className="relative h-64 overflow-hidden bg-gray-200">
                        {album.cover_image_url ? (
                          <img
                            src={album.cover_image_url}
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon size={64} className="text-gray-400" />
                          </div>
                        )}
                        
                        {/* Badge nombre de photos */}
                        <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {album.photo_count || 0} {t('news.gallery.photos')}
                        </div>
                      </div>

                      {/* Informations */}
                      <div className="p-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2 line-clamp-2">
                          {title}
                        </h3>
                        
                        <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Calendar size={16} className="mr-1" />
                            {new Date(album.event_date).toLocaleDateString(
                              i18n.language === 'en' ? 'en-US' : 'fr-FR'
                            )}
                          </span>
                          <span className="flex items-center">
                            <MapPin size={16} className="mr-1" />
                            {album.location}
                          </span>
                        </div>

                        {description && (
                          <p className="text-gray-600 line-clamp-2 mb-4">
                            {description}
                          </p>
                        )}

                        <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                          {t('news.gallery.viewPhotos')} →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Lightbox */}
      {showLightbox && lightboxPhotos.length > 0 && (
        <PhotoLightbox
          photos={lightboxPhotos}
          currentIndex={lightboxIndex}
          onClose={() => setShowLightbox(false)}
          onNavigate={setLightboxIndex}
          language={i18n.language}
        />
      )}
    </div>
  );
}
