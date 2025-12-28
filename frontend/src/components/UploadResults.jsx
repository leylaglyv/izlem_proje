import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './UploadResults.css';

function UploadResults() {
    const [file, setFile] = useState(null);
    const [examName, setExamName] = useState('');
    const [examDate, setExamDate] = useState(new Date().toISOString().split('T')[0]); // Default today
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    // Debug & Connectivity States
    const [technicalDetails, setTechnicalDetails] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [serverStatus, setServerStatus] = useState('checking'); // checking, online, offline

    // Check backend connectivity on mount
    useEffect(() => {
        const checkServer = async () => {
            try {
                await axios.get('http://localhost:8000/');
                setServerStatus('online');
                console.log("Backend connection established.");
            } catch (error) {
                console.error("Server connectivity check failed:", error);
                setServerStatus('offline');
                setMessage('⚠️ Uyarı: Backend sunucusuna erişilemiyor. Lütfen sunucunun (start_backend.bat) çalıştığından emin olun.');
            }
        };
        checkServer();
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setMessage('');
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
            setMessage('');
        }
    };

    const handleUpload = async () => {
        if (!file || !examName || !examDate) {
            setMessage('Lütfen bir dosya seçin ve deneme bilgilerini girin.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        // Metadata (Backend'e gönderilecek)
        // formData.append('exam_name', examName);
        // formData.append('exam_date', examDate);

        setLoading(true);
        setMessage('Analiz yapılıyor, lütfen bekleyin... (Bu işlem biraz sürebilir)');

        try {
            // Şimdilik sadece dosyayı gönderiyoruz, backend güncellenince metadata da ekleriz.
            const response = await axios.post('http://localhost:8000/api/analyze', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 180000, // 3 dakika timeout (Büyük dosyalar ve rate limit için)
            });
            setMessage(`Başarılı! Analiz ID: ${response.data.id || 'Kaydedildi'}`);
            setFile(null); // Reset form
            setExamName('');
        } catch (error) {
            console.error('Upload Error:', error);

            // Build technical details object
            const details = {
                message: error.message,
                code: error.code,
                config: {
                    url: error.config?.url,
                    method: error.config?.method,
                    headers: error.config?.headers
                },
                response: error.response ? {
                    status: error.response.status,
                    data: error.response.data,
                    headers: error.response.headers
                } : 'No response received (Network Error or Timeout)'
            };
            setTechnicalDetails(JSON.stringify(details, null, 2));

            // User friendly message
            let userMsg = 'Bir hata oluştu.';
            if (error.response) {
                userMsg += ` Sunucu Hatası (${error.response.status}): ${error.response.data?.detail || error.message}`;
            } else if (error.request) {
                userMsg += ' Sunucudan yanıt alınamadı. İnternet bağlantınızı ve backend sunucusunu kontrol edin.';
            } else {
                userMsg += ` İstek hatası: ${error.message}`;
            }
            setMessage(userMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="upload-results-container fade-in">
            <div className="upload-card">
                <div className="card-header">
                    <h2>📤 Analiz Yükle</h2>
                    <p>Sınav sonuçlarını yapay zeka ile analiz edin.</p>
                </div>

                <div className="form-grid">
                    <div className="form-group">
                        <label>Deneme Adı</label>
                        <input
                            type="text"
                            value={examName}
                            onChange={(e) => setExamName(e.target.value)}
                            placeholder="Örn: TYT Deneme 1"
                        />
                    </div>
                    <div className="form-group">
                        <label>Uygulama Tarihi</label>
                        <input
                            type="date"
                            value={examDate}
                            onChange={(e) => setExamDate(e.target.value)}
                        />
                    </div>
                </div>

                <div
                    className={`drop-zone ${isDragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current.click()}
                >
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept="application/pdf"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                    />

                    {file ? (
                        <div className="file-info">
                            <span className="file-icon">📄</span>
                            <span className="file-name">{file.name}</span>
                            <span className="change-file-text">(Değiştirmek için tıklayın)</span>
                        </div>
                    ) : (
                        <div className="drop-content">
                            <span className="upload-icon">☁️</span>
                            <h3>Dosyayı buraya sürükleyin</h3>
                            <p>veya seçmek için tıklayın (PDF)</p>
                        </div>
                    )}
                </div>

                <button
                    onClick={handleUpload}
                    disabled={loading || !file || !examName}
                    className={`upload-btn ${loading ? 'loading' : ''}`}
                >
                    {loading ? 'Analiz Ediliyor...' : 'Yükle ve Analiz Et'}
                </button>

                {message && (
                    <div className={`status-message ${message.includes('Başarılı') ? 'success' : 'error'} fade-in`}>
                        {serverStatus === 'offline' && <div className="server-offline-badge">⛔ SUNUCU BAĞLANTISI YOK</div>}
                        <p>{message}</p>

                        {technicalDetails && (
                            <div className="technical-details-container" style={{ marginTop: '15px', textAlign: 'left', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '10px' }}>
                                <button
                                    onClick={() => setShowDetails(!showDetails)}
                                    style={{
                                        fontSize: '0.85rem',
                                        textDecoration: 'underline',
                                        background: 'none',
                                        border: 'none',
                                        color: '#fff',
                                        cursor: 'pointer',
                                        padding: 0,
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {showDetails ? '▼ Teknik Detayları Gizle' : '▶ Teknik Detayları Göster (Debug)'}
                                </button>
                                {showDetails && (
                                    <pre style={{
                                        background: 'rgba(0,0,0,0.3)',
                                        padding: '10px',
                                        borderRadius: '5px',
                                        fontSize: '0.75rem',
                                        overflowX: 'auto',
                                        marginTop: '10px',
                                        maxHeight: '200px',
                                        overflowY: 'auto',
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-word',
                                        fontFamily: 'monospace'
                                    }}>
                                        {technicalDetails}
                                    </pre>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default UploadResults;
