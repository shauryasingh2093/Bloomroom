import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FocusTimer = ({ lightText = true }) => {
    const [duration, setDuration] = useState(25); // minutes
    const [timeLeft, setTimeLeft] = useState(25 * 60); // seconds
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const intervalRef = useRef(null);

    const durations = [
        { value: 25, label: '25 min' },
        { value: 50, label: '50 min' }
    ];

    useEffect(() => {
        if (isActive && !isPaused) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((time) => {
                    if (time <= 1) {
                        handleComplete();
                        return 0;
                    }
                    return time - 1;
                });
            }, 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isActive, isPaused]);

    const handleComplete = () => {
        setIsActive(false);
        setIsPaused(false);
        // Play completion sound (if available)
        const audio = new Audio('/sounds/chime.mp3');
        audio.volume = 0.3;
        audio.play().catch(() => { }); // Fail silently if no sound file
    };

    const handleStart = () => {
        setIsActive(true);
        setIsPaused(false);
    };

    const handlePause = () => {
        setIsPaused(true);
    };

    const handleResume = () => {
        setIsPaused(false);
    };

    const handleReset = () => {
        setIsActive(false);
        setIsPaused(false);
        setTimeLeft(duration * 60);
    };

    const handleDurationChange = (newDuration) => {
        setDuration(newDuration);
        setTimeLeft(newDuration * 60);
        setIsActive(false);
        setIsPaused(false);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;
    const textColor = lightText ? 'text-cream-50' : 'text-slate-800';

    return (
        <div className="space-y-6">
            <h3 className={`text-xs tracking-[0.3em] uppercase font-light ${lightText ? 'text-cream-200/40' : 'text-slate-400'} text-center`}>
                Focus Timer
            </h3>

            {/* Duration Selection */}
            {!isActive && (
                <div className="flex gap-4 justify-center">
                    {durations.map((d) => (
                        <button
                            key={d.value}
                            onClick={() => handleDurationChange(d.value)}
                            className={`px-6 py-3 rounded-2xl text-xs tracking-[0.2em] uppercase transition-all ${duration === d.value
                                    ? 'bg-white/20 text-white shadow-lg'
                                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                                }`}
                        >
                            {d.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Timer Display */}
            <div className="relative flex items-center justify-center py-8">
                <svg className="w-48 h-48 transform -rotate-90">
                    <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="8"
                        fill="none"
                    />
                    <motion.circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 88}`}
                        strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
                        strokeLinecap="round"
                        transition={{ duration: 0.5 }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <p className={`text-5xl font-extralight ${textColor}`}>
                        {formatTime(timeLeft)}
                    </p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
                {!isActive ? (
                    <button
                        onClick={handleStart}
                        className="px-8 py-4 bg-white/20 hover:bg-white/30 text-white rounded-2xl text-xs tracking-[0.3em] uppercase transition-all shadow-lg"
                    >
                        Start Focus
                    </button>
                ) : (
                    <>
                        {isPaused ? (
                            <button
                                onClick={handleResume}
                                className="px-8 py-4 bg-white/20 hover:bg-white/30 text-white rounded-2xl text-xs tracking-[0.3em] uppercase transition-all"
                            >
                                Resume
                            </button>
                        ) : (
                            <button
                                onClick={handlePause}
                                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white/80 rounded-2xl text-xs tracking-[0.3em] uppercase transition-all"
                            >
                                Pause
                            </button>
                        )}
                        <button
                            onClick={handleReset}
                            className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white/60 rounded-2xl text-xs tracking-[0.3em] uppercase transition-all"
                        >
                            Reset
                        </button>
                    </>
                )}
            </div>

            {timeLeft === 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <p className={`text-lg font-light ${textColor} italic`}>
                        ✨ Focus session complete!
                    </p>
                </motion.div>
            )}
        </div>
    );
};

export default FocusTimer;
