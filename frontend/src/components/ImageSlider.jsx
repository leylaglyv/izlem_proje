import React from 'react';
import './ImageSlider.css';
import gasmek4 from '../assets/gasmek4.jpg';
import gasmek2 from '../assets/gasmek2.jpg';
import gasmek3 from '../assets/gasmek3.jpg';

const ImageSlider = () => {
    const slides = [
        { url: gasmek4, title: 'GASMEK Eğitimleri' },
        { url: gasmek2, title: 'Geleceğe Hazırlık' },
        { url: gasmek3, title: 'Başarıya Giden Yol' },
    ];

    return (
        <div className="slider-container fade-in" style={{ animationDelay: '0.5s' }}>
            {slides.map((slide, index) => (
                <div className="image-card" key={index}>
                    <img src={slide.url} alt={slide.title} />
                </div>
            ))}
        </div>
    );
};

export default ImageSlider;
