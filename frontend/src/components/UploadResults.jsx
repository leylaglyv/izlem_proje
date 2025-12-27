import React, { useState, useRef } from 'react';
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
            const response = await axios.post('http://localhost:8000/analyze', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage(`Başarılı! Analiz ID: ${response.data.id}`);
            setFile(null); // Reset form
            setExamName('');
        } catch (error) {
            console.error('Upload Error:', error);
            setMessage('Bir hata oluştu: ' + (error.response?.data?.detail || error.message));
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
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}

export default UploadResults;
