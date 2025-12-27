import React from 'react';
import gbbLogo from './assets/gbb.png';
import SelectionCard from './components/SelectionCard';
import './App.css';

function App() {
  return (
    <div className="app-container">
      {/* Header Section */}
      <header className="main-header">
        <div className="header-left-spacer"></div> {/* Spacer to keep nav centered */}
        <nav className="header-nav">
          <a href="#" className="nav-item">Öğrenci</a>
          <a href="#" className="nav-item">Öğretmen</a>
        </nav>
        <div className="header-subtitle-container">
          <img src={gbbLogo} alt="GBB Logo" className="gbb-logo" />
          <span className="gbb-text">Gaziantep Büyükşehir Belediyesi<br />Destekleri ile</span>
        </div>
      </header>

      {/* Main Content (Cards) */}
      <main className="main-content">
        <div className="cards-container">
          {/* Student Card */}
          <SelectionCard
            title="Öğrenci"
            description="Sınav sonuçlarını keşfet, eksiklerini gör ve sana özel çalışma planı ile hedeflerine ulaş."
            icon={<span role="img" aria-label="student">🎓</span>}
            animationDelay="0s"
          />

          {/* Teacher Card */}
          <SelectionCard
            title="Öğretmen"
            description="Sınıfının durumunu analiz et, öğrencilerinin gelişimini takip et ve onlara rehberlik et."
            icon={<span role="img" aria-label="teacher">👨‍🏫</span>}
            animationDelay="1.5s"
          />
        </div>
      </main>

      {/* Footer Section */}
      <footer className="main-footer">
        © {new Date().getFullYear()} Antigravity Projesi - Gaziantep Büyükşehir Belediyesi Pilot Uygulamasıdır.
      </footer>
    </div>
  );
}

export default App;
