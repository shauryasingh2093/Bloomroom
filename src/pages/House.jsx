// House View - Main 3D isometric house interface
import { useState } from 'react';
import './House.css';

const House = ({ onEnterRoom }) => {
    const [hoveredRoom, setHoveredRoom] = useState(null);

    const rooms = [
        { id: 'entry', name: 'Entry', description: 'Welcome home', position: 'center-bottom' },
        { id: 'planning', name: 'Planning', description: 'Daily tasks', position: 'left-middle' },
        { id: 'clear-head', name: 'Clear My Head', description: 'Overthinking relief', position: 'right-middle' },
        { id: 'future', name: 'Future Me', description: 'Dreams & goals', position: 'left-top' },
        { id: 'care', name: 'Care', description: 'Self-love', position: 'right-top' },
        { id: 'memory', name: 'Memory Nook', description: 'Reflections', position: 'center-top' },
    ];

    return (
        <div className="house-view">
            <div className="house-container">
                {/* Sky background */}
                <div className="house-sky"></div>

                {/* Main house structure */}
                <div className="house-structure">
                    {/* Roof */}
                    <div className="house-roof"></div>

                    {/* Rooms - clickable areas */}
                    <div className="house-rooms">
                        {rooms.map((room) => (
                            <button
                                key={room.id}
                                className={`room room-${room.position} ${hoveredRoom === room.id ? 'hovered' : ''}`}
                                onMouseEnter={() => setHoveredRoom(room.id)}
                                onMouseLeave={() => setHoveredRoom(null)}
                                onClick={() => onEnterRoom(room.id)}
                            >
                                <div className="room-window"></div>
                                <div className="room-light"></div>
                                <div className="room-label">
                                    <span className="room-name">{room.name}</span>
                                    <span className="room-description">{room.description}</span>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Front door (Entry room) */}
                    <div className="house-door" onClick={() => onEnterRoom('entry')}>
                        <div className="door-frame"></div>
                        <div className="door-handle"></div>
                    </div>

                    {/* Garden/ground */}
                    <div className="house-garden">
                        <div className="garden-flower">🌸</div>
                        <div className="garden-flower">🌿</div>
                        <div className="garden-flower">🌸</div>
                    </div>
                </div>

                {/* Welcome text */}
                <div className="house-welcome">
                    <h1>Welcome to your Bloomroom</h1>
                    <p>A soft space to plan, breathe, and grow</p>
                    <p className="house-hint">Click on any room to enter</p>
                </div>
            </div>
        </div>
    );
};

export default House;
