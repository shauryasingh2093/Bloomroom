// Door Swing Animation Component
import { useState, useEffect } from 'react';
import './DoorTransition.css';

const DoorTransition = ({ isOpen, onComplete, doorColor = '#d4a0a0' }) => {
    const [swingState, setSwingState] = useState('closed');

    useEffect(() => {
        if (isOpen) {
            setSwingState('opening');
            const timer = setTimeout(() => {
                setSwingState('open');
                if (onComplete) onComplete();
            }, 2000); // Match --door-swing duration
            return () => clearTimeout(timer);
        } else {
            setSwingState('closed');
        }
    }, [isOpen, onComplete]);

    if (!isOpen && swingState === 'closed') return null;

    return (
        <div className={`door-overlay ${swingState}`}>
            <div className="door-panel" style={{ background: `linear-gradient(135deg, ${doorColor} 0%, #c08888 50%, #a87070 100%)` }}>
                <div className="door-frame-inner"></div>
                <div className="door-handle-inner"></div>
            </div>
        </div>
    );
};

export default DoorTransition;
