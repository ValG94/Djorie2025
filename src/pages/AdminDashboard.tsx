import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  LogOut,
  FileText,
  Video,
  MessageSquare,
  Heart,
  Mail,
  Users,
  Settings,
  Image,
  DollarSign
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    articles: 0,
    videos: 0,
    messages: 0,
    messagesPending: 0,
    albums: 0,
    subscribers: 0,
    donations: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch articles count
      const { count: articlesCount } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true });

      // Fetch videos count
      const { count: videosCount } = await supabase
        .from('videos')
        .select('*', { count: 'exact', head: true });

      // Fetch messages count
      const { count: messagesCount } = await supabase
        .from('citizen_messages')
        .select('*', { count: 'exact', head: true });

      // Fetch pending messages count
      const { count: pendingCount } = await supabase
        .from('citizen_messages')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Fetch albums count
      const { count: albumsCount } = await supabase
        .from('photo_albums')
        .select('*', { count: 'exact', head: true });

      // Fetch subscribers count
      const { count: subscribersCount } = await supabase
        .from('newsletter_subscribers')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Fetch donations count
      const { count: donationsCount } = await supabase
        .from('donations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');

      setStats({
        articles: articlesCount || 0,
        videos: videosCount || 0,
        messages: messagesCount || 0,
        messagesPending: pendingCount || 0,
        albums: albumsCount || 0,
        subscribers: subscribersCount || 0,
        donations: donationsCount || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const sections = [
    {
      title: 'Actualités',
      description: 'Gérer les articles et communiqués',
      icon: FileText,
      color: 'from-blue-600 to-blue-700',
      stats: `${stats.articles} article(s)`,
      path: '/admin/articles',
    },
    {
      title: 'Vidéos',
      description: 'Gérer les discours et vidéos',
      icon: Video,
      color: 'from-red-600 to-red-700',
      stats: `${stats.videos} vidéo(s)`,
      path: '/admin/videos',
    },
    {
      title: 'Messages citoyens',
      description: 'Modérer les messages reçus',
      icon: MessageSquare,
      color: 'from-green-600 to-green-700',
      stats: `${stats.messagesPending} en attente`,
      path: '/admin/messages',
    },
    {
      title: 'Galerie Photo',
      description: 'Gérer les albums et photos',
      icon: Image,
      color: 'from-purple-600 to-purple-700',
      stats: `${stats.albums} album(s)`,
      path: '/admin/gallery',
    },
    {
      title: 'Newsletter',
      description: 'Gérer les abonnés et campagnes',
      icon: Mail,
      color: 'from-indigo-600 to-indigo-700',
      stats: `${stats.subscribers} abonné(s)`,
      path: '/admin/newsletter',
    },
    {
      title: 'Dons',
      description: 'Suivre les contributions',
      icon: DollarSign,
      color: 'from-yellow-600 to-yellow-700',
      stats: `${stats.donations} don(s)`,
      path: '/admin/donations',
    },
    {
      title: 'Programme',
      description: 'Modifier les sections du programme',
      icon: Settings,
      color: 'from-gray-600 to-gray-700',
      stats: 'Bientôt disponible',
      path: null,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Tableau de bord
              </h1>
              <p className="text-sm text-gray-600">
                Connecté en tant que <span className="font-semibold">{user?.name || user?.email}</span>
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Voir le site →
              </a>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut size={18} />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Bienvenue sur le tableau de bord administrateur
          </h2>
          <p className="text-gray-600">
            Gérez le contenu de la plateforme présidentielle Dr Serge Ghislain Djorie
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section, index) => (
            <div
              key={index}
              onClick={() => section.path && navigate(section.path)}
              className={`bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all ${
                section.path ? 'cursor-pointer' : 'opacity-75 cursor-not-allowed'
              }`}
            >
              <div className={`inline-block p-3 rounded-lg bg-gradient-to-r ${section.color} mb-4`}>
                <section.icon size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {section.title}
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                {section.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-500">
                  {section.stats}
                </span>
                <span className={`font-medium text-sm ${section.path ? 'text-blue-600' : 'text-gray-400'}`}>
                  {section.path ? 'Gérer →' : 'Bientôt'}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <Users className="text-green-600 mt-1" size={24} />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                ✅ Modules disponibles (Étape 1)
              </h3>
              <p className="text-gray-700 text-sm mb-2">
                Les modules suivants sont maintenant opérationnels :
              </p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• <strong>Actualités</strong> : Créer, modifier, supprimer des articles avec images</li>
                <li>• <strong>Vidéos</strong> : Gérer les vidéos YouTube avec thumbnails personnalisés</li>
                <li>• <strong>Messages citoyens</strong> : Modérer et répondre aux messages</li>
              </ul>
              <p className="text-sm text-gray-600 mt-3">
                Les autres modules (Dons, Newsletter, Programme) seront ajoutés dans les prochaines étapes.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
