import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Tag } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Post {
  id: string;
  title: string;
  title_en: string;
  excerpt: string;
  excerpt_en: string;
  image_url: string | null;
  category: string;
  published_at: string;
}

export default function News() {
  const { t, i18n } = useTranslation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Campagne', 'Programmes', 'Déclarations', 'Médiation', 'Paix 2020', 'Autre'];

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('posts')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false });

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <section className="relative py-20 bg-gradient-to-r from-blue-900 to-red-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">{t('news.title')}</h1>
          <p className="text-xl text-blue-100">{t('news.subtitle')}</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 mb-8 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-blue-50'
                }`}
              >
                {t(`news.categories.${category}`)}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              {t('news.noArticles')}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => {
                const title = i18n.language === 'en' ? post.title_en : post.title;
                const excerpt = i18n.language === 'en' ? post.excerpt_en : post.excerpt;

                return (
                  <div key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2">
                    {post.image_url && (
                      <img
                        src={post.image_url}
                        alt={title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-6">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                          {post.category}
                        </span>
                        <span className="flex items-center text-xs text-gray-500">
                          <Calendar size={14} className="mr-1" />
                          {new Date(post.published_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                        {title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {excerpt}
                      </p>
                      <button className="text-blue-600 font-semibold hover:text-blue-700">
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
    </div>
  );
}
