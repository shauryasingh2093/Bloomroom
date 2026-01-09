// Planning Room - Daily tasks
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import TaskList from '../components/TaskList';
import './Room.css';

const PlanningRoom = ({ onExit }) => {
    const { getTodaysTasks } = useApp();
    const tasks = getTodaysTasks();

    return (
        <div className="room-page planning-room fade-in">
            <button className="room-exit" onClick={onExit}>
                ← Back to house
            </button>

            <div className="room-content">
                <div className="room-painting-sidebar">
                    <div className="painting-frame">
                        <img src="/paintings/planning_room.png" alt="1% better everyday" />
                    </div>
                    <p className="painting-caption">1% better everyday</p>
                </div>

                <div className="room-main-area">
                    <header className="room-header">
                        <h1>Planning Room</h1>
                        <p className="room-subtitle">What's one small thing you want to do today?</p>
                    </header>

                    <div className="room-body">
                        <div className="task-limit-note">
                            <span>✨</span>
                            <p>Keep it gentle. 3-5 tasks is perfect.</p>
                        </div>

                        <TaskList />

                        {tasks.length === 0 && (
                            <div className="room-encouragement">
                                <p>You don't have to do everything today.</p>
                                <p>One step is enough.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanningRoom;
