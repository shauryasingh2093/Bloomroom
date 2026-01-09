// Greeting Screen - Personalized, emotionally intelligent
import { useState } from 'react';
import { getGreeting } from '../utils/dateHelpers';
import './Greeting.css';

const Greeting = ({ onContinue }) => {
    const [name, setName] = useState(localStorage.getItem('bloomroom_name') || '');
    const [isEditing, setIsEditing] = useState(!localStorage.getItem('bloomroom_name'));
    const greeting = getGreeting();

    const handleSave = () => {
        if (name.trim()) {
            localStorage.setItem('bloomroom_name', name.trim());
            setIsEditing(false);
            setTimeout(onContinue, 1500);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSave();
        }
    };

    if (!isEditing && name) {
        setTimeout(onContinue, 2000);
    }

    return (
        <div className="greeting-screen fade-in">
            <div className="greeting-content">
                {isEditing ? (
                    <>
                        <p className="greeting-question">What should I call you?</p>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="greeting-input"
                            placeholder="Your name..."
                            autoFocus
                        />
                        <button
                            className="greeting-save"
                            onClick={handleSave}
                            disabled={!name.trim()}
                        >
                            Continue
                        </button>
                    </>
                ) : (
                    <>
                        <p className="greeting-time">{greeting}</p>
                        <h2 className="greeting-name">{name}</h2>
                        <p className="greeting-message">You're not late. You're growing.</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default Greeting;
