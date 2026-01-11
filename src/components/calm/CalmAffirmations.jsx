import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CalmAffirmations = ({ lightText = true }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAuto, setIsAuto] = useState(true);

    const affirmations = [
        "You are exactly where you need to be.",
        "This moment is enough.",
        "You are allowed to rest.",
        "Peace is your natural state.",
        "You are safe in this moment.",
        "Your breath is your anchor.",
        "You deserve gentleness.",
        "Everything will unfold in its own time.",
        "You are worthy of calm.",
        "Let go of what you cannot control."
    ];

    useEffect(() => {
        if (isAuto) {
            const timer = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % affirmations.length);
            }, 8000);
            return () => clearInterval(timer);
        }
    }, [isAuto, affirmations.length]);

    const handleNext = () => {
        setIsAuto(false);
        setCurrentIndex((prev) => (prev + 1) % affirmations.length);
    };

    const handlePrevious = () => {
        setIsAuto(false);
        setCurrentIndex((prev) => (prev - 1 + affirmations.length) % affirmations.length);
    };

    const textColor = lightText ? 'text-cream-50' : 'text-slate-800';

    return (
        <div className="space-y-6">
            <div className="relative min-h-[120px] flex items-center justify-center px-8">
                <AnimatePresence mode="wait">
                    <motion.p
                        key={currentIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`text-2xl sm:text-3xl font-extralight ${textColor} text-center leading-relaxed italic`}
                    >
                        "{affirmations[currentIndex]}"
                    </motion.p>
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6">
                <button
                    onClick={handlePrevious}
                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <div className="flex gap-2">
                    {affirmations.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => { setCurrentIndex(idx); setIsAuto(false); }}
                            className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex
                                    ? 'bg-white/60 w-6'
                                    : 'bg-white/20 hover:bg-white/30'
                                }`}
                        />
                    ))}
                </div>

                <button
                    onClick={handleNext}
                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Auto-play toggle */}
            <div className="flex items-center justify-center gap-3">
                <button
                    onClick={() => setIsAuto(!isAuto)}
                    className={`px-4 py-2 rounded-full text-[10px] tracking-[0.2em] uppercase transition-all ${isAuto
                            ? 'bg-white/20 text-white'
                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                        }`}
                >
                    {isAuto ? 'Auto' : 'Manual'}
                </button>
            </div>
        </div>
    );
};

export default CalmAffirmations;
