import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Play, Calendar, MapPin, Clock } from 'lucide-react';
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
}

export default function Videos() {
  const { t, i18n } = useTranslation();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('published', true)
        .order('event_date', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50">
      <section className="relative py-20 bg-gradient-to-r from-red-900 via-blue-900 to-green-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">{t('videos.title')}</h1>
          <p className="text-xl text-red-100">{t('videos.subtitle')}</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600" />
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              {t('videos.noVideos')}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.map((video) => {
                const title = i18n.language === 'en' ? video.title_en : video.title;
                const description = i18n.language === 'en' ? video.description_en : video.description;

                return (
                  <div key={video.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2">
                    <div className="relative">
                      <img
                        src={video.thumbnail_url || 'https://via.placeholder.com/400x225?text=Video'}
                        alt={title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                        <Play size={48} className="text-white" />
                      </div>
                      {video.duration > 0 && (
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs font-semibold">
                          {formatDuration(video.duration)}
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                        {title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                        {description}
                      </p>
                      <div className="space-y-2 text-sm text-gray-500">
                        {video.event_date && (
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-2" />
                            {new Date(video.event_date).toLocaleDateString()}
                          </div>
                        )}
                        {video.location && (
                          <div className="flex items-center">
                            <MapPin size={14} className="mr-2" />
                            {video.location}
                          </div>
                        )}
                      </div>
                      {video.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {video.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
