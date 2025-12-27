import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UploadResults from './UploadResults';
import ClassManagement from './ClassManagement';
import './TeacherDashboard.css';
import '../App.css'; // Re-using existing styles, can be separated if needed

const TeacherDashboard = ({ user, onLogout }) => {
    const [activeTab, setActiveTab] = useState('home'); // 'home', 'upload', 'past', 'class'
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchResults = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8000/api/results');
            setResults(response.data);
        } catch (error) {
            console.error("Error fetching results:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'past') {
            fetchResults();
        }
    }, [activeTab]);

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
                        <div className="card-header-row">
                            <h2>Önceki Analizler</h2>
                            <button className="refresh-btn" onClick={fetchResults}>🔄 Yenile</button>
                        </div>
                        <p>Geçmişte yüklediğiniz sınav analizleri burada listelenmektedir.</p>

                        {loading ? (
                            <div className="loading-state">Yükleniyor...</div>
                        ) : results.length === 0 ? (
                            <div className="empty-state">Henüz hiç analiz bulunmuyor.</div>
                        ) : (
                            <div className="results-grid">
                                {results.map((result, index) => (
                                    <div key={index} className="result-card fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                                        <div className="result-header">
                                            <h3>{result.student_name || 'İsimsiz Öğrenci'}</h3>
                                            <span className="result-date">
                                                {result.created_at ? new Date(result.created_at).toLocaleDateString('tr-TR') : 'Tarih Yok'}
                                            </span>
                                        </div>
                                        <div className="result-body">
                                            <p><strong>Öğrenci No:</strong> {result.student_id || '-'}</p>
                                            <div className="weak-topics-preview">
                                                <strong>Zayıf Konular:</strong>
                                                <ul>
                                                    {result.weak_topics?.slice(0, 3).map((topic, i) => (
                                                        <li key={i}>{topic}</li>
                                                    ))}
                                                    {result.weak_topics?.length > 3 && <li>...</li>}
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="result-footer">
                                            <button className="view-details-btn" onClick={() => console.log('Detay görüntüleme yakında...')}>
                                                Detayları Gör ➡️
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
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
