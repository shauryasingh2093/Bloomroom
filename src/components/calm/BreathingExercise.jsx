import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BreathingExercise = ({ lightText = true }) => {
    const [isActive, setIsActive] = useState(false);
    const [pattern, setPattern] = useState('478'); // '478' or 'box'
    const [phase, setPhase] = useState('inhale'); // 'inhale', 'hold', 'exhale'
    const [count, setCount] = useState(0);
    const timerRef = useRef(null);

    const patterns = {
        '478': {
            name: '4-7-8 Breathing',
            description: 'Calming technique for relaxation',
            phases: [
                { name: 'inhale', duration: 4, text: 'Breathe In' },
                { name: 'hold', duration: 7, text: 'Hold' },
                { name: 'exhale', duration: 8, text: 'Breathe Out' }
            ]
        },
        box: {
            name: 'Box Breathing',
            description: 'Equal breathing for focus',
            phases: [
                { name: 'inhale', duration: 4, text: 'Breathe In' },
                { name: 'hold1', duration: 4, text: 'Hold' },
                { name: 'exhale', duration: 4, text: 'Breathe Out' },
                { name: 'hold2', duration: 4, text: 'Hold' }
            ]
        }
    };

    const currentPattern = patterns[pattern];
    const currentPhaseIndex = currentPattern.phases.findIndex(p => p.name === phase);
    const currentPhase = currentPattern.phases[currentPhaseIndex];

    useEffect(() => {
        if (isActive && currentPhase) {
            if (count < currentPhase.duration) {
                timerRef.current = setTimeout(() => {
                    setCount(count + 1);
                }, 1000);
            } else {
                // Move to next phase
                const nextIndex = (currentPhaseIndex + 1) % currentPattern.phases.length;
                setPhase(currentPattern.phases[nextIndex].name);
                setCount(0);
            }
        }

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [isActive, count, phase, currentPhaseIndex, currentPattern, currentPhase]);

    const handleStart = () => {
        setIsActive(true);
        setPhase(currentPattern.phases[0].name);
        setCount(0);
    };

    const handleStop = () => {
        setIsActive(false);
        setCount(0);
        setPhase(currentPattern.phases[0].name);
    };

    const getCircleScale = () => {
        if (!isActive) return 1;
        const progress = count / currentPhase.duration;
        if (phase === 'inhale') return 1 + progress * 0.5;
        if (phase === 'exhale') return 1.5 - progress * 0.5;
        return phase.includes('hold') ? 1.5 : 1;
    };

    const textColor = lightText ? 'text-cream-50' : 'text-slate-800';
    const subTextColor = lightText ? 'text-cream-200/60' : 'text-slate-600';

    return (
        <div className="space-y-8">
            {/* Pattern Selector */}
            <div className="flex gap-4 justify-center">
                <button
                    onClick={() => { setPattern('478'); handleStop(); }}
                    className={`px-6 py-3 rounded-2xl text-xs tracking-[0.2em] uppercase transition-all ${pattern === '478'
                            ? 'bg-white/20 text-white shadow-lg'
                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                        }`}
                >
                    4-7-8
                </button>
                <button
                    onClick={() => { setPattern('box'); handleStop(); }}
                    className={`px-6 py-3 rounded-2xl text-xs tracking-[0.2em] uppercase transition-all ${pattern === 'box'
                            ? 'bg-white/20 text-white shadow-lg'
                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                        }`}
                >
                    Box
                </button>
            </div>

            {/* Breathing Circle */}
            <div className="flex flex-col items-center justify-center py-12">
                <motion.div
                    animate={{ scale: getCircleScale() }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="relative w-48 h-48 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center"
                >
                    <div className="absolute inset-0 rounded-full bg-white/5 blur-xl" />
                    <div className="relative text-center">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={phase}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={`text-2xl font-light ${textColor} mb-2`}
                            >
                                {currentPhase?.text}
                            </motion.p>
                        </AnimatePresence>
                        {isActive && (
                            <p className={`text-4xl font-extralight ${textColor}`}>
                                {currentPhase.duration - count}
                            </p>
                        )}
                    </div>
                </motion.div>

                {/* Instructions */}
                <div className="mt-8 text-center">
                    <h3 className={`text-xl font-light ${textColor} mb-2`}>
                        {currentPattern.name}
                    </h3>
                    <p className={`text-xs ${subTextColor} tracking-widest uppercase`}>
                        {currentPattern.description}
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
                        Start
                    </button>
                ) : (
                    <button
                        onClick={handleStop}
                        className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white/80 rounded-2xl text-xs tracking-[0.3em] uppercase transition-all"
                    >
                        Stop
                    </button>
                )}
            </div>
        </div>
    );
};

export default BreathingExercise;
