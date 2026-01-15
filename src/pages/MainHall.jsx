import React, { useState, useEffect } from 'react';
import { useApp } from '../context/appContextCore';
import DailyAffirmation from '../components/DailyAffirmation';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileSwitcher from '../components/ProfileSwitcher';
import { getCurrentProfile } from '../utils/profileManager';

const MainHall = ({ onEnterRoom, currentProfile, onProfileChange, onOpenAuth }) => {
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
        { id: 'dark', label: 'Dark', color: 'bg-slate-700' },
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
        focused: 'contrast-[1.05] saturate-[1.05] brightness-[0.98]',
        dark: 'brightness-[0.7] contrast-[1.2] saturate-[0.6]',
        dreamy: 'saturate-[1.05] brightness-[1.02] contrast-[0.98] hue-rotate-[2deg]',
    };

    return (
        <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-gradient-to-br from-planning-dusk via-future-dusk to-care-dusk">
            {/* Profile Switcher */}
            {currentProfile && (
                <ProfileSwitcher
                    currentProfile={currentProfile}
                    onProfileChange={onProfileChange}
                    onOpenAuth={onOpenAuth}
                />
            )}

            {/* Cinematic Grain */}
            <img
                src="/Entered.png"
                alt="Bloomroom Main Hall"
                className={`absolute inset-0 w-full h-full object-cover animate-fade-in transition-all duration-700 ${moodFilters[mood] || ''}`}
                style={{ filter: moodFilters[mood] ? undefined : 'none' }}
            />

            <div className="absolute inset-0 bg-black/15 backdrop-blur-[0.5px]" />

            {/* Top Bar - Mood Selector */}
            <div className="absolute top-4 sm:top-8 left-4 sm:left-8 z-50">
                {/* Mood Selector */}
                <div className="flex gap-2 sm:gap-4 bg-white/5 backdrop-blur-md rounded-full p-1.5 sm:p-2 border border-white/10">
                    {moods.map((m) => (
                        <button
                            key={m.id}
                            onClick={() => changeMood(m.id)}
                            className={`px-3 sm:px-4 py-1.5 rounded-full text-[9px] sm:text-[10px] tracking-[0.2em] uppercase transition-all duration-500 ${mood === m.id
                                ? 'bg-white/20 text-white shadow-lg'
                                : 'text-white/40 hover:text-white/60'
                                }`}
                        >
                            {m.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Glassmorphic Welcome Header - Ultra Compact Mobile */}
            <div className="absolute top-20 sm:top-20 md:top-24 left-0 right-0 flex flex-col items-center pointer-events-none z-10">
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center px-4 sm:px-8 md:px-10 py-3 sm:py-5 md:py-6 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[1.5rem] sm:rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.3)] mx-4 w-auto max-w-[92%] sm:max-w-2xl md:max-w-3xl inline-block"
                >
                    <h2 className="text-[11px] sm:text-xl md:text-2xl lg:text-3xl font-medium tracking-[0.15em] sm:tracking-[0.25em] md:tracking-[0.3em] text-white uppercase leading-relaxed">
                        <span className="inline-block">Hey {userName}!</span>{' '}
                        <span className="inline-block">Welcome Home</span>{' '}
                        <span className="text-base sm:text-xl md:text-2xl inline-block">💜</span>
                    </h2>
                    <div className="h-[1px] w-8 sm:w-12 md:w-16 bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto mt-2 sm:mt-3 md:mt-4 mb-2 sm:mb-3 md:mb-4" />
                    <p className="text-white/60 font-light tracking-[0.15em] sm:tracking-[0.22em] italic text-[8px] sm:text-[10px] md:text-xs leading-relaxed">
                        Choose a room to begin your journey
                    </p>
                </motion.div>
            </div>

            {/* Clickable Hotspots - Enhanced Hover */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-4 sm:gap-8 md:gap-12 p-8 sm:p-16 md:p-24 pointer-events-auto">
                {rooms.map((room) => (
                    <button
                        key={room.id}
                        onClick={() => onEnterRoom(room.id)}
                        className={`${room.pos} flex flex-col items-center justify-center group relative overflow-visible transition-all duration-500`}
                    >
                        {/* Glassmorphic Hover Background */}
                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 backdrop-blur-0 group-hover:backdrop-blur-xl rounded-full transition-all duration-500 scale-[0.85] group-hover:scale-[0.85] opacity-0 group-hover:opacity-100 border border-white/0 group-hover:border-white/20 shadow-none group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]" />

                        <div className="relative z-10 flex flex-col items-center gap-1 sm:gap-2">
                            {/* Room Label */}
                            <span className="text-white font-medium tracking-[0.3em] sm:tracking-[0.4em] uppercase text-xs sm:text-sm md:text-base opacity-70 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110">
                                {room.label}
                            </span>

                            {/* Progress Indicator */}
                            {getRoomProgress(room.id) && (
                                <span className="text-[10px] sm:text-xs text-white/40 tracking-[0.2em] uppercase font-light opacity-0 group-hover:opacity-100 transition-all duration-500 delay-75">
                                    {getRoomProgress(room.id)}
                                </span>
                            )}
                        </div>

                        {/* Center Dot */}
                        <div className="mt-3 sm:mt-4 w-1.5 h-1.5 bg-white/60 rounded-full group-hover:scale-[6] group-hover:bg-white/20 transition-all duration-500" />

                        {/* Room Name on Hover */}
                        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-80 transition-all duration-500 group-hover:-translate-y-1 whitespace-nowrap">
                            <span className="text-[10px] sm:text-xs md:text-sm text-white uppercase tracking-[0.3em] font-light italic">{room.name}</span>
                        </div>
                    </button>
                ))}
            </div>

            <DailyAffirmation />
        </div>
    );
};

export default MainHall;
