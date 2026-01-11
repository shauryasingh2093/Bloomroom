import React, { useState } from 'react';
import RoomWrapper from '../components/RoomWrapper';
import MindDump from '../components/rooms/MindDump';
import BreathingExercise from '../components/calm/BreathingExercise';
import AmbientPlayer from '../components/calm/AmbientPlayer';
import CalmAffirmations from '../components/calm/CalmAffirmations';

const CalmRoom = ({ onBack }) => {
    const [isDimMode, setIsDimMode] = useState(false);

    return (
        <RoomWrapper
            title="Calm Room"
            onBack={onBack}
            colorClass="bg-calm-dusk"
            lightText={true}
        >
            <div className={`max-w-6xl mx-auto px-4 sm:px-6 transition-all duration-1000 ${isDimMode ? 'opacity-70' : 'opacity-100'}`}>
                {/* Header with Dim Mode Toggle */}
                <header className="mb-12 sm:mb-16 text-center relative">
                    <button
                        onClick={() => setIsDimMode(!isDimMode)}
                        className="absolute top-0 right-0 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-[10px] tracking-[0.2em] uppercase transition-all flex items-center gap-2"
                    >
                        <span>{isDimMode ? '☀️' : '🌙'}</span>
                        {isDimMode ? 'Bright' : 'Dim'}
                    </button>

                    <h1 className="text-3xl sm:text-5xl font-extralight tracking-[0.4em] text-cream-50 uppercase">
                        Quiet
                    </h1>
                    <p className="mt-6 text-cream-200/60 font-light tracking-widest italic text-sm">
                        Leave the noise at the door.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Left Column - Breathing & Affirmations */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white/10 backdrop-blur-md p-8 sm:p-12 rounded-[3rem] border border-white/20">
                            <BreathingExercise lightText={true} />
                        </div>

                        <div className="bg-white/10 backdrop-blur-md p-8 sm:p-12 rounded-[3rem] border border-white/20">
                            <CalmAffirmations lightText={true} />
                        </div>
                    </div>

                    {/* Right Column - Ambient Sounds & Mind Dump */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-[3rem] border border-white/20">
                            <AmbientPlayer lightText={true} />
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm p-6 sm:p-8 rounded-[3rem] border border-white/10">
                            <h3 className="text-[10px] tracking-[0.3em] uppercase font-light text-cream-200/40 mb-6">Mind Dump</h3>
                            <MindDump lightText={true} />
                        </div>
                    </div>
                </div>
            </div>
        </RoomWrapper>
    );
};

export default CalmRoom;
