// Daily Focus Component
import { useState, useEffect } from 'react';
import { getQuestionByTime } from '../utils/questionBank';
import Card from './Card';
import './DailyFocus.css';

const DailyFocus = () => {
    const [question, setQuestion] = useState('');
    const [response, setResponse] = useState('');
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        setQuestion(getQuestionByTime());

        // Load saved response from localStorage
        const today = new Date().toDateString();
        const savedData = localStorage.getItem('dailyFocus');
        if (savedData) {
            const parsed = JSON.parse(savedData);
            if (parsed.date === today) {
                setResponse(parsed.response);
                setSaved(true);
            }
        }
    }, []);

    const handleSave = () => {
        const today = new Date().toDateString();
        localStorage.setItem('dailyFocus', JSON.stringify({
            date: today,
            response: response,
            question: question
        }));
        setSaved(true);

        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <Card className="daily-focus-card" padding="large">
            <h3 className="daily-focus-question">{question}</h3>
            <textarea
                className="daily-focus-input"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Take a moment to reflect..."
                rows={3}
            />
            {response && !saved && (
                <button className="daily-focus-save" onClick={handleSave}>
                    Save
                </button>
            )}
            {saved && (
                <div className="daily-focus-saved gentle-fade-in">
                    Saved ✨
                </div>
            )}
        </Card>
    );
};

export default DailyFocus;
