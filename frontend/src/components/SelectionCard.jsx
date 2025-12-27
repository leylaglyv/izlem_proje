import React from 'react';
import './SelectionCard.css';

const SelectionCard = ({ title, description, icon, onSelect, animationDelay }) => {
    return (
        <div
            className="selection-card"
            style={{ animationDelay: animationDelay }}
        >
            <div className="card-content">
                <div className="icon-container">
                    {icon}
                </div>
                <h2 className="card-title">{title}</h2>
                <p className="card-description">{description}</p>
                <button
                    className="select-button"
                    onClick={() => {
                        console.log(`${title} seçildi`);
                        if (onSelect) onSelect();
                    }}
                >
                    Giris Yap
                </button>
            </div>
        </div>
    );
};

export default SelectionCard;
