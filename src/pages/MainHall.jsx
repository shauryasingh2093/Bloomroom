import React, { useState, useEffect } from 'react';
import { useApp } from '../context/appContextCore';
import DailyAffirmation from '../components/DailyAffirmation';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileSwitcher from '../components/ProfileSwitcher';
import { getCurrentProfile } from '../utils/profileManager';

const MainHall = ({ onEnterRoom, currentProfile, onProfileChange }) => {
    const {
        tasks,
        goals,
        mindDumps,
        selfCare,
        streak,
        updateStreak,
        mood,
        changeMood,
        userName,
        changeUserName
    } = useApp();

    const rooms = [
        { id: 'planning', name: 'Planning Room', label: 'Plan', pos: 'col-start-1 row-start-2' },
        { id: 'calm', name: 'Calm Room', label: 'Breathe', pos: 'col-start-2 row-start-2' },
        { id: 'future', name: 'Future Room', label: 'Grow', pos: 'col-start-3 row-start-2' },
        { id: 'care', name: 'Care Room', label: 'Care', pos: 'col-start-1 row-start-3' },
        { id: 'memory', name: 'Memory Corner', label: 'Reflect', pos: 'col-start-3 row-start-3' },
    ];

    const moods = [
        { id: 'focused', label: 'Focused', color: 'bg-blue-400' },
        { id: 'calm', label: 'Calm', color: 'bg-sage-400' },
        { id: 'dreamy', label: 'Dreamy', color: 'bg-rose-300' },
    ];

    const getRoomProgress = (roomId) => {
        if (roomId === 'planning') {
            const today = new Date().toISOString().split('T')[0];
            const todayTasks = tasks.filter(t => !t.date || t.date === today);
            const completed = todayTasks.filter(t => t.completed).length;
            return todayTasks.length > 0 ? `${completed}/${todayTasks.length}` : null;
        }
        if (roomId === 'future') {
            return goals.length > 0 ? `${goals.length} Goals` : null;
        }
        return null;
    };


    const moodFilters = {
        focused: 'contrast-[1.1] saturate-[1.1] brightness-[0.95]',
        calm: 'saturate-[0.8] brightness-[1.05] sepia-[0.1]',
        dreamy: 'saturate-[1.2] brightness-[1.1] contrast-[0.9] hue-rotate-[10deg]',
    };

    return (
        <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-gradient-to-br from-planning-dusk via-future-dusk to-care-dusk">
            {/* Profile Switcher */}
            {currentProfile && (
                <ProfileSwitcher
                    currentProfile={currentProfile}
                    onProfileChange={onProfileChange}
                />
            )}

            {/* Cinematic Grain */}
            <img
                src="/Entered.png"
                alt="Bloomroom Main Hall"
                className="absolute inset-0 w-full h-full object-cover animate-fade-in"
            />

            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />

            {/* Top Bar - Mood Selector */}
            <div className="absolute top-8 left-8 z-50">
                {/* Mood Selector */}
                <div className="flex gap-4 bg-white/5 backdrop-blur-md rounded-full p-2 border border-white/10">
                    {moods.map((m) => (
                        <button
                            key={m.id}
                            onClick={() => changeMood(m.id)}
                            className={`px-4 py-1.5 rounded-full text-[10px] tracking-[0.2em] uppercase transition-all duration-500 ${mood === m.id
                                ? 'bg-white/20 text-white shadow-lg'
                                : 'text-white/40 hover:text-white/60'
                                }`}
                        >
                            {m.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Overlay Content */}
            <div className="absolute inset-0 flex flex-col items-center pt-32 pointer-events-none">
                <div className="text-center animate-slide-up px-6">
                    <h2 className="text-4xl md:text-5xl font-extralight tracking-[0.3em] text-cream-50 uppercase drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                        Hey {userName}! Welcome Home💜
                    </h2>
                    <p className="text-cream-100 font-light mt-8 tracking-[0.2em] italic opacity-90 text-sm md:text-base drop-shadow-md max-w-2xl mx-auto">
                        Choose a room to begin your journey
                    </p>
                </div>
            </div>

            {/* Clickable Hotspots */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-12 p-24 pointer-events-auto">
                {rooms.map((room) => (
                    <button
                        key={room.id}
                        onClick={() => onEnterRoom(room.id)}
                        className={`${room.pos} flex flex-col items-center justify-center group relative overflow-hidden transition-all duration-700`}
                    >
                        <div className="absolute inset-0 bg-cream-50/0 group-hover:bg-cream-50/5 backdrop-blur-0 group-hover:backdrop-blur-[2px] rounded-full transition-all duration-700 scale-50 group-hover:scale-100" />

                        <div className="relative z-10 flex flex-col items-center gap-2">
                            <span className="text-cream-50 font-extralight tracking-[0.4em] uppercase text-xs opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                                {room.label}
                            </span>

                            {getRoomProgress(room.id) && (
                                <span className="text-[10px] text-cream-200/40 tracking-[0.2em] uppercase font-light opacity-0 group-hover:opacity-100 transition-all duration-1000 delay-100">
                                    {getRoomProgress(room.id)}
                                </span>
                            )}
                        </div>

                        <div className="mt-4 w-1 h-1 bg-cream-50 rounded-full opacity-40 group-hover:scale-[8] group-hover:opacity-10 transition-all duration-1000" />

                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-60 transition-opacity duration-1000 whitespace-nowrap">
                            <span className="text-[10px] text-cream-200 uppercase tracking-widest">{room.name}</span>
                        </div>
                    </button>
                ))}
            </div>

            <DailyAffirmation />
        </div>
    );
};

export default MainHall;
