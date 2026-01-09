// Care Room - Body & Soul
import './Room.css';

const CareRoom = ({ onExit }) => {
    return (
        <div className="room-page care-room fade-in">
            <button className="room-exit" onClick={onExit}>← Back to house</button>

            <div className="room-content">
                <div className="room-painting-sidebar">
                    <div className="painting-frame">
                        <img src="/paintings/care_room.png" alt="Body Confidence" />
                    </div>
                    <p className="painting-caption">Nourish with love</p>
                </div>

                <div className="room-main-area">
                    <header className="room-header">
                        <h1>Care Room</h1>
                        <p className="room-subtitle">Your body is your home. Treat it gently.</p>
                    </header>

                    <div className="room-body">
                        <div className="care-actions">
                            <div className="care-card">
                                <h3>Movement</h3>
                                <div className="care-btns">
                                    <button>done</button>
                                    <button>rest</button>
                                </div>
                            </div>
                            <div className="care-card">
                                <h3>Nourishment</h3>
                                <div className="care-btns">
                                    <button>done</button>
                                    <button>rest</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CareRoom;
