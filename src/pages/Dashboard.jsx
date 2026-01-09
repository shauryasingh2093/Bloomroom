// Dashboard - Segmented visual spaces
import { useState } from 'react';
import { getQuestionByTime } from '../utils/questionBank';
import TaskList from '../components/TaskList';
import './Dashboard.css';

const Dashboard = () => {
    const [activeSpace, setActiveSpace] = useState('today');
    const userName = localStorage.getItem('bloomroom_name') || 'friend';
    const dailyQuestion = getQuestionByTime();

    return (
        <div className="dashboard">
            {/* Header */}
            <header className="dashboard-header">
                <div className="header-content">
                    <h1 className="dashboard-title">bloomroom</h1>
                    <p className="dashboard-user">hello, {userName}</p>
                </div>
            </header>

            {/* Space Navigation */}
            <nav className="space-nav">
                <button
                    className={`space-nav-item ${activeSpace === 'today' ? 'active' : ''}`}
                    onClick={() => setActiveSpace('today')}
                >
                    <span className="space-label">Today</span>
                    <span className="space-description">focus & planning</span>
                </button>
                <button
                    className={`space-nav-item ${activeSpace === 'future' ? 'active' : ''}`}
                    onClick={() => setActiveSpace('future')}
                >
                    <span className="space-label">Future Me</span>
                    <span className="space-description">dreams & independence</span>
                </button>
                <button
                    className={`space-nav-item ${activeSpace === 'care' ? 'active' : ''}`}
                    onClick={() => setActiveSpace('care')}
                >
                    <span className="space-label">Care</span>
                    <span className="space-description">health & self-love</span>
                </button>
            </nav>

            {/* Content Spaces */}
            <main className="dashboard-content">
                {activeSpace === 'today' && (
                    <div className="space-container fade-in">
                        <div className="space-background space-bg-today"></div>
                        <div className="space-inner">
                            <section className="space-section">
                                <h2 className="space-heading">{dailyQuestion}</h2>
                                <div className="space-body">
                                    <TaskList />
                                </div>
                            </section>
                        </div>
                    </div>
                )}

                {activeSpace === 'future' && (
                    <div className="space-container fade-in">
                        <div className="space-background space-bg-future"></div>
                        <div className="space-inner">
                            <section className="space-section">
                                <h2 className="space-heading">What does your future look like?</h2>
                                <div className="space-body">
                                    <div className="future-content">
                                        <div className="future-prompt">
                                            <label className="prompt-label">Financial independence means...</label>
                                            <textarea
                                                className="prompt-textarea"
                                                placeholder="Describe your vision..."
                                                rows={4}
                                            />
                                        </div>

                                        <div className="future-prompt">
                                            <label className="prompt-label">A life full of life looks like...</label>
                                            <textarea
                                                className="prompt-textarea"
                                                placeholder="What brings you alive?"
                                                rows={4}
                                            />
                                        </div>

                                        <div className="future-steps">
                                            <h3 className="steps-heading">Small steps toward this future</h3>
                                            <p className="steps-description">What's one thing you can do this month?</p>
                                            <input
                                                type="text"
                                                className="steps-input"
                                                placeholder="One small step..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                )}

                {activeSpace === 'care' && (
                    <div className="space-container fade-in">
                        <div className="space-background space-bg-care"></div>
                        <div className="space-inner">
                            <section className="space-section">
                                <h2 className="space-heading">How are you caring for yourself?</h2>
                                <div className="space-body">
                                    <div className="care-content">
                                        <div className="care-category">
                                            <h3 className="care-category-title">Movement</h3>
                                            <p className="care-category-subtitle">Your body deserves gentle care</p>
                                            <div className="care-options">
                                                <button className="care-option">Done</button>
                                                <button className="care-option">Rest</button>
                                                <button className="care-option">Tomorrow</button>
                                            </div>
                                        </div>

                                        <div className="care-category">
                                            <h3 className="care-category-title">Nourishment</h3>
                                            <p className="care-category-subtitle">Feeding yourself with love</p>
                                            <div className="care-options">
                                                <button className="care-option">Done</button>
                                                <button className="care-option">Rest</button>
                                                <button className="care-option">Tomorrow</button>
                                            </div>
                                        </div>

                                        <div className="care-category">
                                            <h3 className="care-category-title">Rest</h3>
                                            <p className="care-category-subtitle">Sleep is growth too</p>
                                            <div className="care-options">
                                                <button className="care-option">Done</button>
                                                <button className="care-option">Rest</button>
                                                <button className="care-option">Tomorrow</button>
                                            </div>
                                        </div>

                                        <div className="care-reminder">
                                            <p>You're allowed to rest. You're allowed to grow slowly.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
