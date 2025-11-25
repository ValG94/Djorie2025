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
import Youth from './pages/Youth';
import News from './pages/News';
import Videos from './pages/Videos';
import CitizenSpace from './pages/CitizenSpace';
import Donate from './pages/Donate';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

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
                    <Route path="/youth" element={<Youth />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/videos" element={<Videos />} />
                    <Route path="/citizen" element={<CitizenSpace />} />
                    <Route path="/donate" element={<Donate />} />
                    <Route path="/contact" element={<Contact />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
