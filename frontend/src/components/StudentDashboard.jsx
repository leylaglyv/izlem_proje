import React, { useState } from 'react';
import './StudentDashboard.css';

const StudentDashboard = ({ user, onLogout }) => {
    const [activeTab, setActiveTab] = useState('home'); // 'home', 'results', 'profile'

    // Mock data for demonstration
    const [activeResults] = useState([
        { id: 1, examName: 'TYT Deneme 3 (Genel)', date: '2024-12-25', score: 385, net: 82.5, rank: 12 },
        { id: 2, examName: 'AYT Deneme 2 (Fen Bilimleri)', date: '2024-12-18', score: 310, net: 45.0, rank: 18 },
        { id: 3, examName: 'TYT Deneme 2 (Genel)', date: '2024-12-10', score: 360, net: 78.0, rank: 15 },
    ]);

    const lastExam = activeResults[0];

    return (
        <div className="student-dashboard-container fade-in">
            {/* HEADER */}
            <header className="student-nav-header">
                <div className="welcome-section">
                    <span className="avatar">🎓</span>
                    <div className="user-info">
                        <h3>{user?.name}</h3>
                        <span>12. Sınıf (MF)</span>
                    </div>
                </div>

                <nav className="student-nav-links">
                    <button
                        className={`st-nav-btn ${activeTab === 'home' ? 'active' : ''}`}
                        onClick={() => setActiveTab('home')}
                    >
                        Ana Sayfa
                    </button>
                    <button
                        className={`st-nav-btn ${activeTab === 'results' ? 'active' : ''}`}
                        onClick={() => setActiveTab('results')}
                    >
                        Sonuçlarım
                    </button>
                    <button
                        className={`st-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        Profilim
                    </button>
                </nav>
                <button className="st-logout-btn" onClick={onLogout}>Çıkış</button>
            </header>

            {/* CONTENT */}
            <div className="student-content">

                {/* HOME TAB */}
                {activeTab === 'home' && (
                    <div className="dashboard-grid fade-in">
                        {/* Main Stat Card */}
                        <div className="stat-card featured">
                            <div className="stat-header">
                                <h4>🚀 Son Deneme Performansı</h4>
                                <span className="exam-tag">{lastExam.examName}</span>
                            </div>
                            <div className="score-display">
                                <div className="score-circle">
                                    <span className="score-value">{lastExam.score}</span>
                                    <span className="score-label">PUAN</span>
                                </div>
                                <div className="net-display">
                                    <span className="net-value">{lastExam.net} NET</span>
                                    <span className="net-label">Sınıf Sıralaması: <strong>#{lastExam.rank}</strong></span>
                                </div>
                            </div>
                            <div className="progress-bar-container">
                                <div className="progress-label"><span>Hedef: 450 Puan</span><span>%{Math.round((lastExam.score / 450) * 100)}</span></div>
                                <div className="progress-bg"><div className="progress-fill" style={{ width: `${(lastExam.score / 450) * 100}%` }}></div></div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="stat-card">
                            <h4>📊 Genel Başarı</h4>
                            <div className="mini-stats">
                                <div className="mini-stat-item">
                                    <span className="value">4</span>
                                    <span className="label">Girilen Deneme</span>
                                </div>
                                <div className="mini-stat-item">
                                    <span className="value">74.5</span>
                                    <span className="label">Ort. TYT Net</span>
                                </div>
                                <div className="mini-stat-item">
                                    <span className="value">42.0</span>
                                    <span className="label">Ort. AYT Net</span>
                                </div>
                            </div>
                        </div>

                        {/* Motivation Card */}
                        <div className="stat-card motivation">
                            <h4>💡 Günün Tavsiyesi</h4>
                            <p>"Matematik netlerin çok iyi ilerliyor! Ancak Geometri kısmında boş sayın biraz fazla. Bu hafta her gün 20 Geometri sorusu çözmeye ne dersin?"</p>
                        </div>
                    </div>
                )}

                {/* RESULTS TAB */}
                {activeTab === 'results' && (
                    <div className="results-list-card fade-in">
                        <h2>📑 Sınav Geçmişi</h2>
                        <div className="table-responsive">
                            <table className="results-table">
                                <thead>
                                    <tr>
                                        <th>Sınav Adı</th>
                                        <th>Tarih</th>
                                        <th>Puan</th>
                                        <th>Net</th>
                                        <th>Sıralama</th>
                                        <th>Detay</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeResults.map(exam => (
                                        <tr key={exam.id}>
                                            <td>{exam.examName}</td>
                                            <td>{exam.date}</td>
                                            <td className="font-bold">{exam.score}</td>
                                            <td>{exam.net}</td>
                                            <td>#{exam.rank}</td>
                                            <td><button className="detail-btn">İncele</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* PROFILE TAB */}
                {activeTab === 'profile' && (
                    <div className="profile-card fade-in">
                        <div className="profile-header">
                            <div className="profile-avatar-large">👨‍🎓</div>
                            <h2>{user?.name}</h2>
                            <p>12. Sınıf - Sayısal</p>
                        </div>
                        <div className="profile-details">
                            <div className="detail-row">
                                <span>Okul No:</span>
                                <strong>1042</strong>
                            </div>
                            <div className="detail-row">
                                <span>E-posta:</span>
                                <strong>{user?.name.toLowerCase().replace(' ', '.')}@ornekokul.com</strong>
                            </div>
                            <div className="detail-row">
                                <span>Telefon:</span>
                                <strong>0555 555 55 55</strong>
                            </div>
                            <div className="detail-row">
                                <span>Kayıt Tarihi:</span>
                                <strong>15 Eylül 2024</strong>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default StudentDashboard;
