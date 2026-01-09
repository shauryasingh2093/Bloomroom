// Entry Screen - First calming welcome
import { useState, useEffect } from 'react';
import './Entry.css';

const Entry = ({ onEnter }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleEnter = () => {
        setIsVisible(false);
        setTimeout(onEnter, 500);
    };

    return (
        <div className={`entry-screen ${isVisible ? 'visible' : ''}`}>
            <div className="entry-content">
                <div className="entry-symbol">🌸</div>
                <h1 className="entry-title">Bloomroom</h1>
                <p className="entry-subtitle">A soft space to plan, breathe, and grow</p>
                <button className="entry-button" onClick={handleEnter}>
                    Enter
                </button>
            </div>
        </div>
    );
};

export default Entry;
