import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import gbbLogo from './assets/gbb.png';
import Login from './components/Login';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import ContactPage from './components/ContactPage';
import AboutPage from './components/AboutPage';
import LandingPage from './components/LandingPage';
import { LinkedinOutlined, GithubOutlined, TwitterOutlined, InstagramOutlined, ScanOutlined } from '@ant-design/icons';
import './App.css';

function AppContent() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLoginSuccess = (username, type) => {
    const userData = { name: username, type: type };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    if (type === 'Öğrenci') {
      navigate('/student-dashboard');
    } else {
      navigate('/teacher-dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="app-container">
      {/* Header Section */}
      <header className="main-header">
        <div className="header-left-spacer">
          <Link to="/" className="brand-logo-link">
            <div className="brand-logo">
              <ScanOutlined className="brand-icon" />
              <span className="brand-text">İZLEM</span>
            </div>
          </Link>
        </div>
        <nav className="header-nav">
          <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>Ana Sayfa</Link>
          <Link to="/student-login" className={`nav-item ${location.pathname === '/student-login' ? 'active' : ''}`}>Öğrenci</Link>
          <Link to="/teacher-login" className={`nav-item ${location.pathname === '/teacher-login' ? 'active' : ''}`}>Öğretmen</Link>
          <Link to="/contact" className={`nav-item ${location.pathname === '/contact' ? 'active' : ''}`}>İletişim</Link>
          <Link to="/about" className={`nav-item ${location.pathname === '/about' ? 'active' : ''}`}>Hakkımızda</Link>
        </nav>
        <div className="header-subtitle-container">
          <img src={gbbLogo} alt="GBB Logo" className="gbb-logo" />
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route
            path="/student-login"
            element={
              <Login
                userType="Öğrenci"
                onLogin={(username) => handleLoginSuccess(username, 'Öğrenci')}
                onBack={() => navigate('/')}
              />
            }
          />

          <Route
            path="/teacher-login"
            element={
              <Login
                userType="Öğretmen"
                onLogin={(username) => handleLoginSuccess(username, 'Öğretmen')}
                onBack={() => navigate('/')}
              />
            }
          />

          <Route
            path="/teacher-dashboard"
            element={
              user && user.type === 'Öğretmen' ? (
                <TeacherDashboard user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/teacher-login" replace />
              )
            }
          />

          <Route
            path="/student-dashboard"
            element={
              user && user.type === 'Öğrenci' ? (
                <StudentDashboard user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/student-login" replace />
              )
            }
          />

          <Route
            path="/contact"
            element={
              <div className="fade-in" style={{ width: '100%' }}>
                <ContactPage />
                <div style={{ textAlign: 'center', paddingBottom: '40px' }}>
                  <button className="back-button" onClick={() => navigate('/')}>Anasayfaya Dön</button>
                </div>
              </div>
            }
          />

          <Route
            path="/about"
            element={
              <div className="fade-in" style={{ width: '100%' }}>
                <AboutPage />
                <div style={{ textAlign: 'center', paddingBottom: '40px' }}>
                  <button className="back-button" onClick={() => navigate('/')}>Anasayfaya Dön</button>
                </div>
              </div>
            }
          />
        </Routes>
      </main>

      {/* Footer Section */}
      <footer className="main-footer">
        <div className="footer-content">
          <div className="footer-social">
            <a href="#" className="social-icon"><LinkedinOutlined /></a>
            <a href="#" className="social-icon"><GithubOutlined /></a>
            <a href="#" className="social-icon"><TwitterOutlined /></a>
            <a href="#" className="social-icon"><InstagramOutlined /></a>
          </div>

          <div className="footer-nav">
            <Link to="/about">Hakkımızda</Link>
            <Link to="#">Hizmetler</Link>
            <Link to="#">Projeler</Link>
            <Link to="/contact">İletişim</Link>
          </div>
        </div>

        <div className="footer-copyright">
          © {new Date().getFullYear()} GWW tarafından geliştirilmiştir
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
