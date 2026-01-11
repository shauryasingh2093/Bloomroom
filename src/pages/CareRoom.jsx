import React, { useState, useEffect } from 'react';
import RoomWrapper from '../components/RoomWrapper';
import { useApp } from '../context/appContextCore';
import { getQuestionByTime } from '../utils/questionBank';
import { saveDailyCheckins, loadDailyCheckins } from '../utils/storage';

const CareRoom = ({ onBack }) => {
    const { selfCare, updateSelfCare } = useApp();
    const [question] = useState(getQuestionByTime());
    const [dailyCheckins, setDailyCheckins] = useState(() => loadDailyCheckins());
    const [checkinText, setCheckinText] = useState('');

    const activities = [
        { id: 'water', label: 'Hydration', icon: '💧' },
        { id: 'stretch', label: 'Stretch', icon: '🧘' },
        { id: 'sunlight', label: 'Sunlight', icon: '☀️' },
        { id: 'meditate', label: 'Quiet Time', icon: '☁️' },
    ];

    const today = new Date().toISOString().split('T')[0];
    const todayCare = selfCare[today] || {};

    useEffect(() => {
        // Load today's check-in if it exists
        if (dailyCheckins[today]) {
            setCheckinText(dailyCheckins[today]);
        }
    }, [today, dailyCheckins]);

    const toggleActivity = (id) => {
        updateSelfCare(today, id, !todayCare[id]);
    };

    const handleCheckinSave = () => {
        if (checkinText.trim()) {
            const updated = { ...dailyCheckins, [today]: checkinText };
            setDailyCheckins(updated);
            saveDailyCheckins(updated);
        }
    };

    // Get last 7 days for habit tracker
    const getLast7Days = () => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push(date.toISOString().split('T')[0]);
        }
        return days;
    };

    const last7Days = getLast7Days();

    return (
        <RoomWrapper
            title="Care Room"
            onBack={onBack}
            colorClass="bg-[#C18805]"
            lightText={true}
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <header className="mb-12 sm:mb-20 text-center">
                    <p className="text-cream-200/60 tracking-[0.4em] uppercase text-[10px] font-light mb-4">
                        Tending to the Self
                    </p>
                    <h1 className="text-3xl sm:text-5xl font-extralight tracking-[0.3em] text-cream-50 uppercase">
                        Nurture
                    </h1>
                    <div className="mt-8 w-16 h-[1px] bg-white/20 mx-auto" />
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left Column - Care Rituals & Habit Tracker */}
                    <section className="space-y-8">
                        <div className="bg-white/10 backdrop-blur-md p-6 sm:p-10 rounded-[3rem] border border-white/20 shadow-sm">
                            <h3 className="text-[10px] tracking-[0.3em] uppercase font-light text-cream-200/40 mb-10">Care Rituals</h3>
                            <div className="grid grid-cols-2 gap-4 sm:gap-6">
                                {activities.map(activity => (
                                    <button
                                        key={activity.id}
                                        onClick={() => toggleActivity(activity.id)}
                                        className={`p-4 sm:p-6 rounded-3xl flex flex-col items-center justify-center gap-3 sm:gap-4 transition-all duration-500 ${todayCare[activity.id] ? 'bg-white/30 text-white shadow-lg' : 'bg-white/5 text-cream-200/40 hover:bg-white/10'}`}
                                    >
                                        <span className="text-2xl">{activity.icon}</span>
                                        <span className={`text-[10px] tracking-widest uppercase font-light ${todayCare[activity.id] ? 'text-white' : 'text-cream-200/60'}`}>{activity.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Habit Tracker */}
                        <div className="bg-white/10 backdrop-blur-md p-6 sm:p-10 rounded-[3rem] border border-white/20 shadow-sm">
                            <h3 className="text-[10px] tracking-[0.3em] uppercase font-light text-cream-200/40 mb-6">Weekly Habits</h3>
                            <div className="space-y-4">
                                {activities.map(activity => (
                                    <div key={activity.id} className="flex items-center gap-3">
                                        <span className="text-sm w-16 text-cream-200/60">{activity.icon}</span>
                                        <div className="flex gap-2 flex-1">
                                            {last7Days.map(date => {
                                                const dayData = selfCare[date] || {};
                                                const isComplete = dayData[activity.id];
                                                return (
                                                    <div
                                                        key={date}
                                                        className={`flex-1 h-8 rounded-lg transition-all ${isComplete
                                                            ? 'bg-white/30'
                                                            : 'bg-white/5'
                                                            }`}
                                                        title={new Date(date).toLocaleDateString()}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 flex justify-between text-[9px] text-cream-200/40 uppercase tracking-wider">
                                <span>7 days ago</span>
                                <span>Today</span>
                            </div>
                        </div>
                    </section>

                    {/* Right Column - Daily Check-in */}
                    <section className="flex flex-col gap-8">
                        <div className="bg-white/10 backdrop-blur-md p-6 sm:p-10 rounded-[3rem] border border-white/20 flex-1">
                            <h3 className="text-[10px] tracking-[0.3em] uppercase font-light text-cream-200/40 mb-8">Daily Check-in</h3>
                            <p className="text-xl sm:text-2xl font-extralight text-cream-50 leading-relaxed mb-8">
                                {question}
                            </p>
                            <textarea
                                value={checkinText}
                                onChange={(e) => setCheckinText(e.target.value)}
                                onBlur={handleCheckinSave}
                                placeholder="Write a few words for yourself..."
                                className="w-full bg-white/5 rounded-2xl p-4 sm:p-6 font-light text-cream-100 text-sm sm:text-base border border-white/10 outline-none focus:ring-1 focus:ring-white/20 h-32 resize-none placeholder:text-white/20"
                            />
                            {checkinText && (
                                <p className="mt-4 text-[10px] text-cream-200/40 italic">Auto-saved</p>
                            )}
                        </div>

                        <div className="bg-white/5 p-6 sm:p-8 rounded-3xl border border-white/10">
                            <p className="text-xs sm:text-sm text-cream-200/60 font-light italic text-center">
                                "You deserve the same kindness you give so freely to others."
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </RoomWrapper>
    );
};

export default CareRoom;
