import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTopOnNavigate from './components/ScrollToTopOnNavigate';
import Home from './pages/Home';
import Biography from './pages/Biography';
import Vision from './pages/Vision';
import Program from './pages/Program';
import ProfessionDeFoi from './pages/ProfessionDeFoi';
import Youth from './pages/Youth';
import News from './pages/News';
import Videos from './pages/Videos';
import CitizenSpace from './pages/CitizenSpace';
import Donate from './pages/Donate';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminArticles from './pages/admin/AdminArticles';
import AdminVideos from './pages/admin/AdminVideos';
import AdminMessages from './pages/admin/AdminMessages';
import AdminGallery from './pages/admin/AdminGallery';
import AdminNewsletter from './pages/admin/AdminNewsletter';
import AdminDonations from './pages/admin/AdminDonations';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTopOnNavigate />
      <AuthProvider>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/articles"
            element={
              <ProtectedRoute>
                <AdminArticles />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/videos"
            element={
              <ProtectedRoute>
                <AdminVideos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/messages"
            element={
              <ProtectedRoute>
                <AdminMessages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/gallery"
            element={
              <ProtectedRoute>
                <AdminGallery />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/newsletter"
            element={
              <ProtectedRoute>
                <AdminNewsletter />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/donations"
            element={
              <ProtectedRoute>
                <AdminDonations />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow pt-20">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/biography" element={<Biography />} />
                    <Route path="/vision" element={<Vision />} />
                    <Route path="/program" element={<Program />} />
                    <Route path="/profession-de-foi" element={<ProfessionDeFoi />} />
                    <Route path="/youth" element={<Youth />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/videos" element={<Videos />} />
                    <Route path="/citizen" element={<CitizenSpace />} />
                    <Route path="/donate" element={<Donate />} />
                    <Route path="/contact" element={<Contact />} />
                  </Routes>
                </main>
                <Footer />
                <ScrollToTop />
              </div>
              
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
