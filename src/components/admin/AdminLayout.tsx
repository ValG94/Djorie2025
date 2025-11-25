import { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  LogOut,
  FileText,
  Video,
  MessageSquare,
  LayoutDashboard
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export default function AdminLayout({ children, title, description }: AdminLayoutProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const navigation = [
    {
      name: 'Tableau de bord',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Actualités',
      href: '/admin/articles',
      icon: FileText,
    },
    {
      name: 'Vidéos',
      href: '/admin/videos',
      icon: Video,
    },
    {
      name: 'Messages citoyens',
      href: '/admin/messages',
      icon: MessageSquare,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {description && (
                <p className="text-sm text-gray-600 mt-1">{description}</p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <nav className="flex space-x-1 p-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
          <p className="text-sm text-blue-900">
            Connecté en tant que{' '}
            <span className="font-semibold">{user?.name || user?.email}</span>
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
