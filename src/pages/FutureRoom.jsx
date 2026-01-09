// Future Room - Dreams & Independence
import { useApp } from '../context/AppContext';
import './Room.css';

const FutureRoom = ({ onExit }) => {
    return (
        <div className="room-page future-room fade-in">
            <button className="room-exit" onClick={onExit}>← Back to house</button>

            <div className="room-content">
                <div className="room-painting-sidebar">
                    <div className="painting-frame">
                        <img src="/paintings/future_room.png" alt="Independence & Vision" />
                    </div>
                    <p className="painting-caption">The sunrise of your life</p>
                </div>

                <div className="room-main-area">
                    <header className="room-header">
                        <h1>Future Room</h1>
                        <p className="room-subtitle">"This is where you’re going. Take your time."</p>
                    </header>

                    <div className="room-body">
                        <div className="vision-prompts">
                            <div className="vision-prompt">
                                <h3>Financial independence means...</h3>
                                <textarea placeholder="Write your vision here..."></textarea>
                            </div>
                            <div className="vision-prompt">
                                <h3>A life full of life looks like...</h3>
                                <textarea placeholder="What brings you alive?"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FutureRoom;
