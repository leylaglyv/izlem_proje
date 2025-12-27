import React, { useState } from 'react';
import UploadResults from './UploadResults';
import ClassManagement from './ClassManagement';
import './TeacherDashboard.css';
import '../App.css'; // Re-using existing styles, can be separated if needed

const TeacherDashboard = ({ user, onLogout }) => {
    const [activeTab, setActiveTab] = useState('home'); // 'home', 'upload', 'past', 'class'

    return (
        <div className="dashboard-container fade-in">
            {/* Teacher Dashboard Header */}
            <header className="dashboard-nav-header">
                <div className="welcome-text">Merhaba, {user?.name}</div>
                <nav className="dashboard-nav-links">
                    <button
                        className={`dash-nav-btn ${activeTab === 'home' ? 'active' : ''}`}
                        onClick={() => setActiveTab('home')}
                    >
                        Ana Sayfa
                    </button>
                    <button
                        className={`dash-nav-btn ${activeTab === 'upload' ? 'active' : ''}`}
                        onClick={() => setActiveTab('upload')}
                    >
                        Analiz Yükle
                    </button>
                    <button
                        className={`dash-nav-btn ${activeTab === 'past' ? 'active' : ''}`}
                        onClick={() => setActiveTab('past')}
                    >
                        Önceki Analizler
                    </button>
                    <button
                        className={`dash-nav-btn ${activeTab === 'class' ? 'active' : ''}`}
                        onClick={() => setActiveTab('class')}
                    >
                        Sınıfım
                    </button>
                </nav>
                <button className="logout-btn" onClick={onLogout}>Çıkış Yap</button>
            </header>

            {/* Content Area */}
            <div className="dashboard-content">
                {activeTab === 'home' && (
                    <div className="welcome-card fade-in">
                        <h1>Hoş Geldiniz, Öğretmenim! 👋</h1>
                        <p>Öğrencilerinizin gelişimini takip etmek için menüyü kullanabilirsiniz.</p>
                        <div className="quick-actions">
                            <div className="action-card" onClick={() => setActiveTab('upload')}>
                                <span className="icon">📤</span>
                                <h3>Yeni Sonuç Yükle</h3>
                                <p>Deneme sınavı PDF'ini yükleyip analiz edin.</p>
                            </div>
                            <div className="action-card" onClick={() => setActiveTab('class')}>
                                <span className="icon">👨‍🎓</span>
                                <h3>Sınıf Listesi</h3>
                                <p>Öğrencilerinizi görüntüleyin ve düzenleyin.</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'upload' && (
                    <UploadResults />
                )}

                {activeTab === 'past' && (
                    <div className="content-card fade-in">
                        <h2>Önceki Analizler</h2>
                        <p>Geçmişte yüklediğiniz sınav analizleri burada listelenecek.</p>
                        <br />
                        <p><em>(Yapım aşamasında...)</em></p>
                    </div>
                )}

                {activeTab === 'class' && (
                    <ClassManagement />
                )}
            </div>
        </div>
    );
};

export default TeacherDashboard;
