import React from 'react';
import { useNavigate } from 'react-router-dom';
import student3d from '../assets/student_3d.png';
import teacher3d from '../assets/teacher_3d.png';
import SelectionCard from './SelectionCard';
import { CloudUploadOutlined, RobotOutlined, RocketOutlined } from '@ant-design/icons';
import '../App.css';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <>
            {/* Dynamic Background Orbs */}
            <div className="bg-orb orb-1"></div>
            <div className="bg-orb orb-2"></div>

            {/* Hero Section */}
            <div className="hero-section fade-in">
                <h1 className="hero-title">
                    Geleceğini Şekillendir:<br />
                    <span className="text-gradient">Yapay Zeka Destekli</span> Sınav Analizi
                </h1>
                <p className="hero-subtitle">
                    PDF sınav sonuçlarını yükle, kişiselleştirilmiş analizlerle başarını katla.
                </p>
            </div>

            <div className="cards-container fade-in" style={{ zIndex: 2, position: 'relative' }}>
                <SelectionCard
                    title="Öğrenci"
                    description="Sınav sonuçlarını keşfet, eksiklerini gör ve sana özel çalışma planı ile hedeflerine ulaş."
                    icon={<img src={student3d} alt="Öğrenci" className="card-icon" />}
                    animationDelay="0s"
                    onSelect={() => navigate('/student-login')}
                />

                <SelectionCard
                    title="Öğretmen"
                    description="Sınıfının durumunu analiz et, öğrencilerinin gelişimini takip et ve onlara rehberlik et."
                    icon={<img src={teacher3d} alt="Öğretmen" className="card-icon" />}
                    animationDelay="0.2s"
                    onSelect={() => navigate('/teacher-login')}
                />
            </div>

            {/* How It Works Section */}
            <div className="how-it-works fade-in" style={{ animationDelay: '0.4s' }}>
                <h2 className="section-title">Nasıl Çalışır?</h2>
                <div className="steps-container">
                    <div className="step-item">
                        <div className="step-icon-box">
                            <CloudUploadOutlined />
                        </div>
                        <h3>1. PDF Yükle</h3>
                        <p>Deneme sınavı sonuç belgeni sisteme yükle.</p>
                    </div>
                    <div className="step-card-connector"></div>
                    <div className="step-item">
                        <div className="step-icon-box">
                            <RobotOutlined />
                        </div>
                        <h3>2. Yapay Zeka Analizi</h3>
                        <p>Sistem eksiklerini ve güçlü yönlerini analiz etsin.</p>
                    </div>
                    <div className="step-card-connector"></div>
                    <div className="step-item">
                        <div className="step-icon-box">
                            <RocketOutlined />
                        </div>
                        <h3>3. Başarını Katla</h3>
                        <p>Sana özel çalışma önerileriyle hedeflerine ulaş.</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LandingPage;
