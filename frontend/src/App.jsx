import React, { useState } from 'react';
import gbbLogo from './assets/gbb.png';
import SelectionCard from './components/SelectionCard';
import UploadResults from './components/UploadResults';
import Login from './components/Login';
import TeacherDashboard from './components/TeacherDashboard';
import './App.css';

function App() {
  // Views: 'landing', 'student-login', 'teacher-login', 'student-dashboard', 'teacher-dashboard', 'contact', 'about'
  const [activeView, setActiveView] = useState('landing');
  const [user, setUser] = useState(null); // Validated user

  const handleNavClick = (view, e) => {
    if (e) e.preventDefault();
    setActiveView(view);
  };

  const handleLoginSuccess = (username, type) => {
    setUser({ name: username, type: type });
    if (type === 'Öğrenci') {
      setActiveView('student-dashboard');
    } else {
      setActiveView('teacher-dashboard');
    }
  };

  return (
    <div className="app-container">
      {/* Header Section */}
      <header className="main-header">
        <div className="header-left-spacer"></div>
        <nav className="header-nav">
          <a href="#" className="nav-item" onClick={(e) => handleNavClick('landing', e)}>Ana Sayfa</a>
          <a href="#" className="nav-item" onClick={(e) => handleNavClick('student-login', e)}>Öğrenci</a>
          <a href="#" className="nav-item" onClick={(e) => handleNavClick('teacher-login', e)}>Öğretmen</a>
          <a href="#" className="nav-item" onClick={(e) => handleNavClick('contact', e)}>İletişim</a>
          <a href="#" className="nav-item" onClick={(e) => handleNavClick('about', e)}>Hakkımızda</a>
        </nav>
        <div className="header-subtitle-container">
          <img src={gbbLogo} alt="GBB Logo" className="gbb-logo" />
          <span className="gbb-text">Gaziantep Büyükşehir Belediyesi<br />Destekleri ile</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">

        {/* LANDING PAGE */}
        {activeView === 'landing' && (
          <div className="cards-container fade-in">
            <SelectionCard
              title="Öğrenci"
              description="Sınav sonuçlarını keşfet, eksiklerini gör ve sana özel çalışma planı ile hedeflerine ulaş."
              icon={<span role="img" aria-label="student">🎓</span>}
              animationDelay="0s"
              onSelect={() => setActiveView('student-login')}
            />

            <SelectionCard
              title="Öğretmen"
              description="Sınıfının durumunu analiz et, öğrencilerinin gelişimini takip et ve onlara rehberlik et."
              icon={<span role="img" aria-label="teacher">👨‍🏫</span>}
              animationDelay="1.5s"
              onSelect={() => setActiveView('teacher-login')}
            />
          </div>
        )}

        {/* LOGIN SCREENS */}
        {(activeView === 'student-login' || activeView === 'teacher-login') && (
          <Login
            userType={activeView === 'student-login' ? 'Öğrenci' : 'Öğretmen'}
            onLogin={(username) => handleLoginSuccess(username, activeView === 'student-login' ? 'Öğrenci' : 'Öğretmen')}
            onBack={() => setActiveView('landing')}
          />
        )}

        {/* DASHBOARDS */}
        {activeView === 'teacher-dashboard' && (
          <TeacherDashboard user={user} onLogout={() => setActiveView('landing')} />
        )}

        {activeView === 'student-dashboard' && (
          <div className="page-container fade-in">
            <div className="dashboard-header">
              <h3>Hoş geldin, {user?.name} (Öğrenci)</h3>
              <button className="logout-btn" onClick={() => setActiveView('landing')}>Çıkış Yap</button>
            </div>
            <div className="content-card">
              <h2>Öğrenci Paneli</h2>
              <p>Burası analiz sonuçlarının ve performans grafiklerinin gösterileceği alandır.</p>
              <br />
              <p><em>(Geliştirme aşamasında...)</em></p>
            </div>
          </div>
        )}

        {/* INFO PAGES */}
        {activeView === 'contact' && (
          <div className="page-container fade-in">
            <h2 className="page-title">İletişim</h2>
            <div className="content-card">
              <p>Bize ulaşmak için aşağıdaki kanalları kullanabilirsiniz.</p>
              <br />
              <p><strong>E-posta:</strong> info@antigravity.com</p>
              <p><strong>Adres:</strong> Gaziantep Büyükşehir Belediyesi</p>
            </div>
            <button className="back-button" onClick={() => setActiveView('landing')}>Anasayfaya Dön</button>
          </div>
        )}

        {activeView === 'about' && (
          <div className="page-container fade-in">
            <h2 className="page-title">Hakkımızda</h2>
            <div className="content-card">
              <p>Antigravity projesi, Gaziantep Büyükşehir Belediyesi desteğiyle öğrencilerin sınav başarılarını artırmak için geliştirilmiş yapay zeka destekli bir analiz platformudur.</p>
              <br />
              <p>Amacımız, eğitimde fırsat eşitliği sağlamak ve her öğrenciye özel rehberlik sunmaktır.</p>
            </div>
            <button className="back-button" onClick={() => setActiveView('landing')}>Anasayfaya Dön</button>
          </div>
        )}

      </main>

      {/* Footer Section */}
      <footer className="main-footer">
        © {new Date().getFullYear()} Antigravity Projesi - Gaziantep Büyükşehir Belediyesi Pilot Uygulamasıdır.
      </footer>
    </div>
  );
}

export default App;
