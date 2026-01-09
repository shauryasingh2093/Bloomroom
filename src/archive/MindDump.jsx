// Mind Dump Page - Overthinking Relief Space
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getAIResponse, formatAIResponse } from '../utils/aiResponses';
import { TextArea } from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import './MindDump.css';

const MindDump = () => {
    const { addMindDump, mindDumps } = useApp();
    const [input, setInput] = useState('');
    const [currentResponse, setCurrentResponse] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!input.trim()) return;

        setIsProcessing(true);

        // Simulate processing time for more natural feel
        setTimeout(() => {
            const response = getAIResponse(input);
            const formattedResponse = formatAIResponse(response);

            setCurrentResponse(formattedResponse);
            addMindDump(input, formattedResponse);
            setInput('');
            setIsProcessing(false);
        }, 800);
    };

    const handleNewDump = () => {
        setCurrentResponse(null);
        setInput('');
    };

    return (
        <div className="mind-dump-page fade-in">
            <header className="page-header">
                <h1>Overthinking Relief</h1>
                <p className="page-subtitle">A safe space to release what's weighing on you</p>
            </header>

            <div className="mind-dump-content">
                {!currentResponse ? (
                    <Card className="mind-dump-input-card" padding="large">
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="mind-dump-input" className="mind-dump-label">
                                What's on your mind?
                            </label>
                            <TextArea
                                id="mind-dump-input"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Let it all out. No judgment here..."
                                rows={8}
                                disabled={isProcessing}
                            />
                            <div className="mind-dump-actions">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={!input.trim() || isProcessing}
                                >
                                    {isProcessing ? 'Processing...' : 'Share'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                ) : (
                    <div className="mind-dump-response gentle-fade-in">
                        <Card className="response-card" padding="large">
                            <div className="response-section">
                                <h3 className="response-heading">💚</h3>
                                <p className="response-text">{currentResponse.reassurance}</p>
                            </div>

                            <div className="response-section">
                                <h3 className="response-heading">🌿</h3>
                                <p className="response-text">{currentResponse.grounding}</p>
                            </div>

                            <div className="response-section">
                                <h3 className="response-heading">✨</h3>
                                <p className="response-text">{currentResponse.nextStep}</p>
                            </div>

                            <div className="response-actions">
                                <Button variant="primary" onClick={handleNewDump}>
                                    New Reflection
                                </Button>
                            </div>
                        </Card>
                    </div>
                )}

                {mindDumps.length > 0 && !currentResponse && (
                    <div className="mind-dump-history">
                        <h3>Past Reflections</h3>
                        <div className="history-list">
                            {mindDumps.slice(0, 5).map((dump) => (
                                <Card key={dump.id} className="history-item" padding="medium" hover>
                                    <p className="history-content">{dump.content}</p>
                                    <p className="history-date">
                                        {new Date(dump.createdAt).toLocaleDateString()}
                                    </p>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MindDump;
