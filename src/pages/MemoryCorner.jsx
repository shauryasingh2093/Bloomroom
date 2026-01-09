// Memory Corner - Proof of Living
import './Room.css';

const MemoryCorner = ({ onExit }) => {
    return (
        <div className="room-page memory-room fade-in">
            <button className="room-exit" onClick={onExit}>← Back to house</button>

            <div className="room-content">
                <div className="room-painting-sidebar">
                    <div className="painting-frame">
                        <img src="/paintings/memory_corner.png" alt="Everyday Beauty" />
                    </div>
                    <p className="painting-caption">Proof of living</p>
                </div>

                <div className="room-main-area">
                    <header className="room-header">
                        <h1>Memory Corner</h1>
                        <p className="room-subtitle">Everyday beauty is worth remembering.</p>
                    </header>

                    <div className="room-body">
                        <div className="memory-notes">
                            <div className="memory-note">
                                <p>"Today felt like..."</p>
                                <textarea placeholder="A small note..."></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemoryCorner;
