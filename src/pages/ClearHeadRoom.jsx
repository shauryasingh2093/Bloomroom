// Clear My Head Room - Overthinking relief
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getAIResponse, formatAIResponse } from '../utils/aiResponses';
import { TextArea } from '../components/Input';
import Button from '../components/Button';
import './Room.css';

const ClearHeadRoom = ({ onExit }) => {
    const { addMindDump } = useApp();
    const [input, setInput] = useState('');
    const [response, setResponse] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        setIsProcessing(true);

        setTimeout(() => {
            const aiResponse = getAIResponse(input);
            const formatted = formatAIResponse(aiResponse);
            setResponse(formatted);
            addMindDump(input, formatted);
            setInput('');
            setIsProcessing(false);
        }, 800);
    };

    const handleNew = () => {
        setResponse(null);
        setInput('');
    };

    return (
        <div className="room-page clear-head-room fade-in">
            <button className="room-exit" onClick={onExit}>
                ← Back to house
            </button>

            <div className="room-content">
                <div className="room-painting-header">
                    <div className="painting-frame">
                        <img src="/paintings/calm_room.png" alt="Abstract Peace" />
                    </div>
                </div>

                <header className="room-header">
                    <h1>Clear My Head</h1>
                    <p className="room-subtitle">A safe space to release what's weighing on you</p>
                </header>

                <div className="room-body">
                    {!response ? (
                        <form onSubmit={handleSubmit} className="clear-head-form">
                            <TextArea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Let it all out. No judgment here..."
                                rows={8}
                                disabled={isProcessing}
                            />
                            <div className="clear-head-actions">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={!input.trim() || isProcessing}
                                >
                                    {isProcessing ? 'Listening...' : 'Share'}
                                </Button>
                                <Button variant="ghost">I need reassurance</Button>
                            </div>
                        </form>
                    ) : (
                        <div className="ai-response gentle-fade-in">
                            <div className="response-item">
                                <span className="response-icon">💚</span>
                                <p>{response.reassurance}</p>
                            </div>
                            <div className="response-item">
                                <span className="response-icon">🌿</span>
                                <p>{response.grounding}</p>
                            </div>
                            <div className="response-item">
                                <span className="response-icon">✨</span>
                                <p>{response.nextStep}</p>
                            </div>
                            <Button variant="gentle" onClick={handleNew}>
                                New reflection
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClearHeadRoom;
