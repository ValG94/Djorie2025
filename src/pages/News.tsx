import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, Image as ImageIcon, FileText, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import PhotoLightbox from '../components/PhotoLightbox';
import PDFViewer from '../components/PDFViewer';
import ArticleModal from '../components/ArticleModal';

interface Article {
  id: string;
  title: string;
  title_en: string;
  content: string;
  content_en: string;
  image_url: string | null;
  pdf_url: string | null;
  category: string;
  published: boolean;
  created_at: string;
  updated_at: string;
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
  
  // PDF Viewer state
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfTitle, setPdfTitle] = useState<string>('');
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  
  // Article Modal state
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showArticleModal, setShowArticleModal] = useState(false);

  const categories = [
    { value: 'all', label: 'Toutes' },
    { value: 'campaign', label: 'Campagne' },
    { value: 'programs', label: 'Programmes' },
    { value: 'declarations', label: 'Déclarations' },
    { value: 'mediation', label: 'Médiation' },
    { value: 'peace2020', label: 'Paix 2020' },
    { value: 'other', label: 'Autre' },
  ];

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
        .order('created_at', { ascending: false })
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
        .order('event_date', { ascending: false});

      if (albumsError) throw albumsError;

      // Compter les photos pour chaque album
      const albumsWithCount = await Promise.all(
        (albumsData || []).map(async (album) => {
          const { count } = await supabase
            .from('photos')
            .select('*', { count: 'exact', head: true })
            .eq('album_id', album.id);

          return { ...album, photo_count: count || 0 };
        })
      );

      setAlbums(albumsWithCount);
    } catch (error) {
      console.error('Error fetching albums:', error);
    } finally {
      setLoadingAlbums(false);
    }
  };

  const openAlbumLightbox = async (albumId: string) => {
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

  // Déterminer si une URL est un PDF
  const isPDF = (url: string | null): boolean => {
    if (!url) return false;
    return url.toLowerCase().endsWith('.pdf');
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
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-6 py-2 rounded-full font-semibold transition-all ${
                    selectedCategory === category.value
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-blue-50 shadow'
                  }`}
                >
                  {category.label}
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
                  const content = i18n.language === 'en' ? article.content_en : article.content;
                  const excerpt = content.substring(0, 150) + '...';
                  const hasPDF = article.pdf_url !== null;
                  const hasImage = article.image_url !== null;

                  return (
                    <div
                      key={article.id}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2"
                    >
                      {/* Image de couverture ou icône PDF */}
                      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-gray-100">
                        {hasImage ? (
                          // Image de couverture (cliquable si PDF)
                          <div
                            className={hasPDF ? 'cursor-pointer' : ''}
                            onClick={() => {
                              if (hasPDF && article.pdf_url) {
                                setPdfUrl(article.pdf_url);
                                setPdfTitle(title);
                                setShowPDFViewer(true);
                              }
                            }}
                          >
                            <img
                              src={article.image_url}
                              alt={title}
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                            />
                            {hasPDF && (
                              <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full flex items-center space-x-1 shadow-lg">
                                <FileText size={16} />
                                <span className="text-xs font-semibold">PDF</span>
                              </div>
                            )}
                          </div>
                        ) : hasPDF ? (
                          // Icône PDF si pas d'image de couverture
                          <div 
                            className="h-full flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-gradient-to-br hover:from-blue-100 hover:to-gray-200 transition-colors"
                            onClick={() => {
                              if (article.pdf_url) {
                                setPdfUrl(article.pdf_url);
                                setPdfTitle(title);
                                setShowPDFViewer(true);
                              }
                            }}
                          >
                            <FileText size={64} className="text-red-600 mb-4" />
                            <p className="text-sm font-semibold text-gray-700 mb-3">
                              Document PDF
                            </p>
                            <button
                              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                            >
                              <FileText size={18} />
                              <span className="text-sm">Prévisualiser</span>
                            </button>
                          </div>
                        ) : (
                          // Placeholder si ni image ni PDF
                          <div className="h-full flex items-center justify-center bg-gray-200">
                            <ImageIcon size={48} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                            {article.category}
                          </span>
                          <span className="flex items-center text-xs text-gray-500">
                            <Calendar size={14} className="mr-1" />
                            {new Date(article.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                          {title}
                        </h3>
                        
                        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                          {excerpt}
                        </p>
                        
                        <button 
                          onClick={() => {
                            setSelectedArticle(article);
                            setShowArticleModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 font-semibold text-sm flex items-center transition-colors"
                        >
                          {t('news.readMore')}
                          <span className="ml-2">→</span>
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

            {loadingAlbums ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
              </div>
            ) : albums.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
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
                      onClick={() => openAlbumLightbox(album.id)}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer"
                    >
                      {album.cover_image_url && (
                        <div className="relative h-56 overflow-hidden">
                          <img
                            src={album.cover_image_url}
                            alt={title}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                            <ImageIcon size={16} />
                            <span>{album.photo_count}</span>
                          </div>
                        </div>
                      )}
                      
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {title}
                        </h3>
                        
                        {description && (
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            {new Date(album.event_date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <MapPin size={14} className="mr-1" />
                            {album.location}
                          </span>
                        </div>
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
      {showLightbox && (
        <PhotoLightbox
          photos={lightboxPhotos}
          currentIndex={lightboxIndex}
          onClose={() => setShowLightbox(false)}
          onNavigate={setLightboxIndex}
        />
      )}

      {/* PDF Viewer */}
      {showPDFViewer && pdfUrl && (
        <PDFViewer
          pdfUrl={pdfUrl}
          title={pdfTitle}
          onClose={() => setShowPDFViewer(false)}
        />
      )}

      {/* Article Modal */}
      <ArticleModal
        article={selectedArticle}
        isOpen={showArticleModal}
        onClose={() => {
          setShowArticleModal(false);
          setSelectedArticle(null);
        }}
        onOpenPDF={(url, title) => {
          setPdfUrl(url);
          setPdfTitle(title);
          setShowPDFViewer(true);
          setShowArticleModal(false);
        }}
      />
    </div>
  );
}
