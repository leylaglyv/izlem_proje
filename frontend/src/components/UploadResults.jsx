import React, { useState } from 'react';
import axios from 'axios';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Rendering Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                    <h3 className="font-bold text-lg">Bir hata oluştu (Görüntüleme Hatası)</h3>
                    <p>{this.state.error && this.state.error.toString()}</p>
                    <button
                        className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        onClick={() => this.setState({ hasError: false })}
                    >
                        Tekrar Dene
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

const UploadResults = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // 'success', 'error', null
    const [message, setMessage] = useState('');
    const [resultData, setResultData] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setStatus(null);
        setMessage('');
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Lütfen bir PDF dosyası seçin.');
            setStatus('error');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);
        setStatus(null);

        try {
            // Corrected endpoint to match backend
            const response = await axios.post('http://localhost:8001/api/analyze', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log(response.data);
            setStatus('success');
            setMessage(`Başarılı! ${response.data.count} öğrenci analizi kaydedildi.`);
            setResultData(response.data.results);
        } catch (error) {
            console.error(error);
            setStatus('error');
            const errorMsg = error.response?.data?.detail || error.message || 'Yükleme sırasında bir hata oluştu.';
            setMessage(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ErrorBoundary>
            <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Sonuç Yükle (Öğretmen)</h2>
                <p className="text-gray-600 mb-6">
                    Öğrencilerin deneme sonuçlarını içeren PDF dosyasını yükleyin. Yapay zeka her sayfayı ayrı bir öğrenci olarak analiz edip kaydedecektir.
                </p>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
                    onClick={() => document.getElementById('fileInput').click()}>
                    <input
                        type="file"
                        id="fileInput"
                        accept="application/pdf"
                        className="hidden"
                        onChange={handleFileChange}
                    />

                    {file ? (
                        <div className="text-gray-700">
                            <span className="font-semibold">{file.name}</span> seçildi.
                        </div>
                    ) : (
                        <div className="text-gray-500">
                            Dosyayı buraya sürükleyin veya <span className="text-primary font-medium">seçmek için tıklayın</span>
                        </div>
                    )}
                </div>

                <button
                    onClick={handleUpload}
                    disabled={loading || !file}
                    className={`w-full mt-6 py-3 px-4 rounded-lg font-medium text-white transition-colors
                        ${loading || !file
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-primary hover:bg-indigo-700'}`}
                >
                    {loading ? 'Analiz Ediliyor...' : 'Yükle ve Analiz Et'}
                </button>

                {/* Status Messages */}
                {status && (
                    <div className={`mt-4 p-4 rounded-md ${status === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                        {message}
                    </div>
                )}

                {/* Results Preview */}
                {resultData && Array.isArray(resultData) && (
                    <div className="mt-8">
                        <h3 className="text-lg font-semibold mb-4">Analiz Sonuçları</h3>
                        <div className="space-y-6">
                            {resultData.map((student, index) => (
                                <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-lg font-bold text-gray-800">{student?.student_name || 'İsimsiz Öğrenci'}</h4>
                                        <span className="text-sm bg-blue-100 text-blue-800 py-1 px-2 rounded">
                                            No: {student?.student_id || '-'}
                                        </span>
                                    </div>

                                    <div className="overflow-x-auto mb-4">
                                        <table className="min-w-full text-sm">
                                            <thead>
                                                <tr className="bg-gray-200">
                                                    <th className="px-4 py-2 text-left">Ders</th>
                                                    <th className="px-4 py-2 text-center">Doğru</th>
                                                    <th className="px-4 py-2 text-center">Yanlış</th>
                                                    <th className="px-4 py-2 text-center">Net</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {student.results && Array.isArray(student.results) && student.results.map((subject, idx) => (
                                                    <tr key={idx} className="border-b border-gray-100">
                                                        <td className="px-4 py-2 font-medium">{subject?.subject || '-'}</td>
                                                        <td className="px-4 py-2 text-center text-green-600">{subject?.D ?? 0}</td>
                                                        <td className="px-4 py-2 text-center text-red-600">{subject?.Y ?? 0}</td>
                                                        <td className="px-4 py-2 text-center font-bold">{subject?.N ?? 0}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="bg-yellow-50 p-3 rounded-md mb-2">
                                        <p className="text-sm">
                                            <span className="font-semibold text-yellow-800">Tavsiye:</span> {student?.suggestion || 'Tavsiye yok.'}
                                        </p>
                                    </div>

                                    {student.weak_topics && Array.isArray(student.weak_topics) && student.weak_topics.length > 0 && (
                                        <div className="flex gap-2 flex-wrap">
                                            {student.weak_topics.map((topic, i) => (
                                                <span key={i} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                                                    {topic}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
};

export default UploadResults;
