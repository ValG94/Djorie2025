import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Play, Calendar, MapPin, Eye, Share2, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Video {
  id: string;
  title: string;
  title_en: string;
  description: string;
  description_en: string;
  video_url: string;
  thumbnail_url: string | null;
  location: string | null;
  tags: string[];
  duration: number;
  event_date: string | null;
  views: number;
  published: boolean;
  created_at: string;
}

export default function Videos() {
  const { t, i18n } = useTranslation();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVideos = videos.filter(video => {
    const title = i18n.language === 'en' ? video.title_en : video.title;
    const description = i18n.language === 'en' ? video.description_en : video.description;
    const query = searchQuery.toLowerCase();
    
    return (
      title.toLowerCase().includes(query) ||
      description.toLowerCase().includes(query) ||
      video.location?.toLowerCase().includes(query) ||
      video.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  const handleVideoClick = async (videoId: string, videoUrl: string) => {
    // Increment views in database
    try {
      const { error } = await supabase
        .from('videos')
        .update({ views: videos.find(v => v.id === videoId)!.views + 1 })
        .eq('id', videoId);

      if (error) throw error;

      // Update local state
      setVideos(prev => prev.map(v => 
        v.id === videoId ? { ...v, views: v.views + 1 } : v
      ));
    } catch (error) {
      console.error('Failed to increment views:', error);
    }
    
    // Open video in new tab
    window.open(videoUrl, '_blank');
  };

  const handleShare = (video: Video, platform: string) => {
    const url = window.location.origin + '/videos';
    const title = i18n.language === 'en' ? video.title_en : video.title;
    const text = `${title} - Dr Serge Ghislain Djorie 2025`;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert(i18n.language === 'fr' ? 'Lien copié !' : 'Link copied!');
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const formatDuration = (seconds: number) => {
    if (!seconds || seconds === 0) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Image */}
      <section className="relative h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/declarationcandidature.jpeg"
            alt="Vidéos de Campagne"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            {t('videos.hero.title')}
          </h1>
          <p className="text-2xl md:text-3xl text-blue-200 mb-4">
            {t('videos.hero.subtitle')}
          </p>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t('videos.hero.description')}
          </p>
        </div>
      </section>

      {/* Search Bar */}
      <section className="py-8 bg-gradient-to-br from-blue-50 to-green-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('videos.search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Videos Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
              <p className="mt-4 text-gray-600">{t('common.loading')}</p>
            </div>
          ) : filteredVideos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                {searchQuery ? t('videos.no_results') : t('videos.no_videos')}
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {t('videos.section_title')}
                </h2>
                <p className="text-xl text-gray-600">
                  {filteredVideos.length} {filteredVideos.length === 1 ? t('videos.video') : t('videos.videos')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredVideos.map((video) => {
                  const title = i18n.language === 'en' ? video.title_en : video.title;
                  const description = i18n.language === 'en' ? video.description_en : video.description;

                  return (
                    <div 
                      key={video.id} 
                      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
                    >
                      {/* Thumbnail with Play Button */}
                      <div className="relative h-56 bg-gray-200 overflow-hidden group cursor-pointer">
                        <img 
                          src={video.thumbnail_url || '/declarationcandidature.jpeg'} 
                          alt={title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleVideoClick(video.id, video.video_url)}
                            className="bg-white rounded-full p-5 hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-110 shadow-2xl"
                          >
                            <Play className="w-10 h-10" fill="currentColor" />
                          </button>
                        </div>
                        {video.duration > 0 && (
                          <div className="absolute bottom-3 right-3 bg-black/80 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                            {formatDuration(video.duration)}
                          </div>
                        )}
                      </div>

                      {/* Card Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
                          {title}
                        </h3>
                        
                        {description && (
                          <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
                            {description}
                          </p>
                        )}

                        {/* Metadata */}
                        <div className="flex flex-col gap-2 text-sm text-gray-500 mb-4">
                          {video.event_date && (
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                              <span>
                                {new Date(video.event_date).toLocaleDateString(
                                  i18n.language === 'fr' ? 'fr-FR' : 'en-US',
                                  { year: 'numeric', month: 'long', day: 'numeric' }
                                )}
                              </span>
                            </div>
                          )}
                          
                          {video.location && (
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                              <span className="line-clamp-1">{video.location}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center text-blue-600 font-semibold">
                            <Eye className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span>
                              {video.views || 0} {i18n.language === 'fr' ? 'vues' : 'views'}
                            </span>
                          </div>
                        </div>

                        {/* Tags */}
                        {video.tags && video.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {video.tags.slice(0, 3).map((tag, index) => (
                              <span 
                                key={index} 
                                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Share Buttons */}
                        <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                          <Share2 className="w-4 h-4 text-gray-500 flex-shrink-0" />
                          <button
                            onClick={() => handleShare(video, 'whatsapp')}
                            className="text-green-600 hover:text-green-700 text-xs font-medium transition-all duration-200 hover:scale-110 hover:font-semibold"
                          >
                            WhatsApp
                          </button>
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={() => handleShare(video, 'facebook')}
                            className="text-blue-600 hover:text-blue-700 text-xs font-medium transition-all duration-200 hover:scale-110 hover:font-semibold"
                          >
                            Facebook
                          </button>
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={() => handleShare(video, 'twitter')}
                            className="text-sky-500 hover:text-sky-600 text-xs font-medium transition-all duration-200 hover:scale-110 hover:font-semibold"
                          >
                            X
                          </button>
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={() => handleShare(video, 'copy')}
                            className="text-gray-600 hover:text-gray-700 text-xs font-medium transition-all duration-200 hover:scale-110 hover:font-semibold"
                          >
                            {i18n.language === 'fr' ? 'Copier' : 'Copy'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-900 via-green-800 to-yellow-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('videos.cta.title')}
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            {t('videos.cta.description')}
          </p>
        </div>
      </section>
    </div>
  );
}
