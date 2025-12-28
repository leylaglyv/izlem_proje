import React from 'react';
import './ResultDetail.css';

const ResultDetail = ({ result, onBack }) => {
    if (!result) return null;

    // Helper to safely access nested data
    const score = result.score_analysis || {};
    const topics = result.topic_analysis || {};
    const comparison = result.comparison || {};
    const subjects = result.results || [];

    return (
        <div className="result-detail-container">
            <button className="back-btn" onClick={onBack}>
                ← Listeye Dön
            </button>

            {/* Header: Student Info & Main Score */}
            <div className="detail-header">
                <div className="student-info">
                    <h2>{result.student_name || 'İsimsiz Öğrenci'}</h2>
                    <div className="sub-info">
                        <span>No: {result.student_id || '-'}</span> |
                        <span> Sınıf: {result.student_class || 'Belirtilmemiş'}</span> |
                        <span> Tarih: {new Date(result.created_at).toLocaleDateString('tr-TR')}</span>
                    </div>
                </div>
                <div className="score-badge-large">
                    <div className="score">{score.tyt_score ? score.tyt_score.toFixed(2) : '-'}</div>
                    <div className="label">TYT PUANI</div>
                </div>
            </div>

            <div className="detail-grid">
                {/* Left Column: Rankings & Comments */}
                <div className="left-col" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* Rankings Card */}
                    <div className="detail-card">
                        <h3>🏆 Sıralama Bilgileri</h3>
                        <table className="rankings-table">
                            <thead>
                                <tr>
                                    <th>Kurum (Okul)</th>
                                    <th>İlçe</th>
                                    <th>Genel (Türkiye)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><span className="rank-value">#{score.institution_rank || '-'}</span></td>
                                    <td><span className="rank-value">#{score.district_rank || '-'}</span></td>
                                    <td><span className="rank-value">#{score.general_rank || '-'}</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Comparison Card */}
                    <div className="detail-card">
                        <h3>📊 Performans Analizi</h3>
                        <div className="comparison-box">
                            <p><strong>Genel Ort. Kıyasla:</strong> {comparison.student_vs_general || 'Veri yok'}</p>
                            <p><strong>Sınıf Ort. Kıyasla:</strong> {comparison.student_vs_class || 'Veri yok'}</p>
                            <p><strong>Genel Ortalama Puanı:</strong> {score.general_avg || '-'}</p>
                        </div>
                    </div>

                    {/* Suggestion Card */}
                    <div className="detail-card">
                        <h3>💡 Yapay Zeka Tavsiyesi</h3>
                        <div className="suggestion-box">
                            <p>{result.suggestion || "Özel bir tavsiye oluşturulamadı."}</p>
                        </div>
                    </div>

                    {/* Topic Analysis (Full Width in Column) */}
                    <div className="detail-card">
                        <h3>🎯 Konu Analizi</h3>
                        <div className="topic-analysis-container">
                            <div className="topic-col">
                                <h4>✅ Başarılı Konular</h4>
                                <ul className="topic-list success">
                                    {topics.successful_topics && topics.successful_topics.length > 0 ? (
                                        topics.successful_topics.map((t, i) => <li key={i}>{t}</li>)
                                    ) : (<li>Belirgin bir veri yok.</li>)}
                                </ul>
                            </div>
                            <div className="topic-col">
                                <h4>⚠️ Geliştirilmeli</h4>
                                <ul className="topic-list fail">
                                    {topics.failed_topics && topics.failed_topics.length > 0 ? (
                                        topics.failed_topics.map((t, i) => <li key={i}>{t}</li>)
                                    ) : (
                                        // Fallback to weak_topics if failed_topics is empty (backward compatibility)
                                        result.weak_topics && result.weak_topics.length > 0 ?
                                            result.weak_topics.map((t, i) => <li key={i}>{t}</li>) :
                                            <li>Hatalı konu tespit edilemedi.</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Subject Details */}
                <div className="right-col">
                    <div className="detail-card">
                        <h3>📚 Ders Bazlı Netler</h3>
                        <div className="subject-table-container">
                            <table className="subject-table">
                                <thead>
                                    <tr>
                                        <th>Ders</th>
                                        <th>D</th>
                                        <th>Y</th>
                                        <th>Net</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subjects.map((sub, idx) => (
                                        <tr key={idx}>
                                            <td>{sub.subject}</td>
                                            <td>{sub.D}</td>
                                            <td>{sub.Y}</td>
                                            <td className="net-cell">{sub.N}</td>
                                        </tr>
                                    ))}
                                    {subjects.length === 0 && (
                                        <tr><td colSpan="4" style={{ textAlign: 'center' }}>Ders verisi bulunamadı.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultDetail;
