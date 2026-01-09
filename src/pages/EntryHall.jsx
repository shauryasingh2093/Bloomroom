// Cinematic Hallway / Exterior - The walk-through entry
import { useState, useEffect } from 'react';
import './EntryHall.css';

const EntryHall = ({ onEnter }) => {
    const [isWalking, setIsWalking] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const handleOpenDoor = () => {
        setIsWalking(true);
        setTimeout(onEnter, 2500); // Wait for slow camera glide
    };

    return (
        <div className={`cinematic-exterior ${isVisible ? 'visible' : ''} ${isWalking ? 'zooming' : ''}`}>
            <div className="exterior-content">
                <div className="house-title-overlay">
                    <h1 className="cinematic-title">Bloomroom</h1>
                    <p className="cinematic-subtitle">A soft space to plan, breathe, and grow</p>
                </div>

                <div className="cinematic-house-container">
                    <div className="house-interactive" onClick={handleOpenDoor}>
                        {/* Using the 3D clay house design logic but as a cinematic focal point */}
                        <div className="cinematic-door-portal">
                            <div className="portal-light"></div>
                            <p className="portal-hint">tap to enter</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EntryHall;
