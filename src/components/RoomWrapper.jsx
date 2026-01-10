import React from 'react';
import { motion } from 'framer-motion';
import '../Cinematic.css';

const RoomWrapper = ({ children, title, onBack, colorClass = 'bg-cream-100', lightText = false }) => {
    const textColor = lightText ? 'text-cream-50' : 'text-slate-800';
    const subTextColor = lightText ? 'text-cream-200/60' : 'text-slate-600';
    const borderColor = lightText ? 'border-white/10' : 'border-slate-200/50';

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className={`fixed inset-0 w-screen h-screen overflow-hidden ${colorClass} flex flex-col`}
        >
            {/* Cinematic Background Elements */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
                <div className="cinematic-grain" />
                <div className="warm-overlay" />
            </div>

            {/* Room Header / Navigation */}
            <div className={`relative z-10 p-8 flex justify-between items-center bg-white/5 backdrop-blur-sm border-b ${borderColor}`}>
                <h2 className={`text-2xl font-extralight tracking-[0.2em] ${textColor} uppercase`}>
                    {title}
                </h2>
                <button
                    onClick={onBack}
                    className={`group flex items-center gap-3 text-sm tracking-widest uppercase font-light ${subTextColor} hover:text-white transition-colors`}
                >
                    <span className={`w-8 h-[1px] ${lightText ? 'bg-cream-200/40' : 'bg-slate-400'} group-hover:w-12 ${lightText ? 'group-hover:bg-white' : 'group-hover:bg-slate-900'} transition-all`}></span>
                    Back to Hallway
                </button>
            </div>

            {/* Room Content Area */}
            <div className="relative z-10 flex-1 overflow-auto p-8 md:p-12 lg:p-16">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1, duration: 1.2, ease: "easeOut" }}
                >
                    {children}
                </motion.div>
            </div>

            {/* Particles can be added here if needed */}
        </motion.div>
    );
};

export default RoomWrapper;
