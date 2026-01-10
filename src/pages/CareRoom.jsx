import React, { useState } from 'react';
import RoomWrapper from '../components/RoomWrapper';
import { useApp } from '../context/AppContext';
import { getQuestionByTime } from '../utils/questionBank';

const CareRoom = ({ onBack }) => {
    const { selfCare, updateSelfCare } = useApp();
    const [question] = useState(getQuestionByTime());
    const activities = [
        { id: 'water', label: 'Hydration', icon: '💧' },
        { id: 'stretch', label: 'Stretch', icon: '🧘' },
        { id: 'sunlight', label: 'Sunlight', icon: '☀️' },
        { id: 'meditate', label: 'Quiet Time', icon: '☁️' },
    ];

    const today = new Date().toISOString().split('T')[0];
    const todayCare = selfCare[today] || {};

    const toggleActivity = (id) => {
        updateSelfCare(today, id, !todayCare[id]);
    };

    return (
        <RoomWrapper
            title="Care Room"
            onBack={onBack}
            colorClass="bg-care-dusk"
            lightText={true}
        >
            <div className="max-w-4xl mx-auto">
                <header className="mb-20 text-center">
                    <p className="text-cream-200/60 tracking-[0.4em] uppercase text-[10px] font-light mb-4">
                        Tending to the Self
                    </p>
                    <h1 className="text-5xl font-extralight tracking-[0.3em] text-cream-50 uppercase">
                        Nurture
                    </h1>
                    <div className="mt-8 w-16 h-[1px] bg-white/20 mx-auto" />
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <section className="bg-white/40 backdrop-blur-xl p-10 rounded-[3rem] border border-white/50 shadow-sm">
                        <h3 className="text-[10px] tracking-[0.3em] uppercase font-light text-slate-400 mb-10">Care Rituals</h3>
                        <div className="grid grid-cols-2 gap-6">
                            {activities.map(activity => (
                                <button
                                    key={activity.id}
                                    onClick={() => toggleActivity(activity.id)}
                                    className={`p-6 rounded-3xl flex flex-col items-center justify-center gap-4 transition-all duration-500 ${todayCare[activity.id] ? 'bg-peach-100 text-peach-700' : 'bg-white/30 text-slate-400 hover:bg-white/60'}`}
                                >
                                    <span className="text-2xl">{activity.icon}</span>
                                    <span className="text-[10px] tracking-widest uppercase font-medium">{activity.label}</span>
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="flex flex-col gap-8">
                        <div className="bg-white/30 backdrop-blur-md p-10 rounded-[3rem] border border-white/30 flex-1">
                            <h3 className="text-[10px] tracking-[0.3em] uppercase font-light text-slate-400 mb-8">Daily Check-in</h3>
                            <p className="text-2xl font-extralight text-slate-700 leading-relaxed mb-8">
                                {question}
                            </p>
                            <textarea
                                placeholder="Write a few words for yourself..."
                                className="w-full bg-white/20 rounded-2xl p-6 font-light text-slate-600 border-none outline-none focus:ring-1 focus:ring-peach-200 h-32 resize-none"
                            />
                        </div>

                        <div className="bg-peach-100/50 p-8 rounded-3xl border border-peach-200/30">
                            <p className="text-xs text-peach-700 font-light italic text-center">
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
