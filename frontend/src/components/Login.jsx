import React, { useState } from 'react';
import './Login.css';

const Login = ({ userType, onLogin, onBack }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, validation would go here.
        // For now, we simulate a successful login.
        console.log(`${userType} login attempt: ${username}`);
        onLogin(username);
    };

    const isStudent = userType === 'Öğrenci';

    return (
        <div className="login-container fade-in">
            <div className={`login-card ${isStudent ? 'student-theme' : 'teacher-theme'}`}>
                <div className="login-header">
                    <span className="login-icon">{isStudent ? '🎓' : '👨‍🏫'}</span>
                    <h2>{userType} Girişi</h2>
                    <p>Devam etmek için lütfen giriş yapın.</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="username">Kullanıcı Adı</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Kullanıcı adınızı girin"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Şifre</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="login-button">
                        Giriş Yap
                    </button>
                </form>

                <button className="back-link" onClick={onBack}>
                    ← Ana Sayfaya Dön
                </button>
            </div>
        </div>
    );
};

export default Login;
