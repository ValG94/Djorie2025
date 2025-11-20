import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  LogOut,
  FileText,
  Video,
  MessageSquare,
  Heart,
  Mail,
  Users,
  Settings
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

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
      stats: '0 articles',
    },
    {
      title: 'Vidéos',
      description: 'Gérer les discours et vidéos',
      icon: Video,
      color: 'from-red-600 to-red-700',
      stats: '0 vidéos',
    },
    {
      title: 'Messages citoyens',
      description: 'Modérer les messages reçus',
      icon: MessageSquare,
      color: 'from-green-600 to-green-700',
      stats: '0 en attente',
    },
    {
      title: 'Dons',
      description: 'Suivre les contributions',
      icon: Heart,
      color: 'from-yellow-600 to-yellow-700',
      stats: '0 XAF',
    },
    {
      title: 'Newsletter',
      description: 'Gérer les abonnés',
      icon: Mail,
      color: 'from-purple-600 to-purple-700',
      stats: '0 abonnés',
    },
    {
      title: 'Programme',
      description: 'Modifier les sections du programme',
      icon: Settings,
      color: 'from-gray-600 to-gray-700',
      stats: '6 sections',
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
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all cursor-pointer"
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
                <span className="text-blue-600 font-medium text-sm">
                  Gérer →
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <Users className="text-blue-600 mt-1" size={24} />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Interface d'administration en cours de développement
              </h3>
              <p className="text-gray-700 text-sm">
                Les fonctionnalités complètes de gestion de contenu (CRUD) seront ajoutées
                dans les prochaines versions. Pour l'instant, vous pouvez gérer le contenu
                directement via l'interface Supabase ou nous contacter pour des modifications.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
