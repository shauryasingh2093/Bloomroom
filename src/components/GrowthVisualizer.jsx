import React from 'react';
import { motion } from 'framer-motion';

const GrowthVisualizer = ({ goals = [], goalTarget = 15 }) => {
    const totalGoals = goals.length;
    const completedGoals = goals.filter(g => g.completed).length;

    // Growth mechanics:
    // - Adding a goal: stem grows taller (shows potential)
    // - Completing a goal: branch + flower blooms (shows achievement)
    // - Growth is proportional to goalTarget for a sense of completion
    const baseHeight = 60; // Starting height
    const maxHeight = 280; // Maximum height when target is reached

    // Calculate progress toward target
    const progressRatio = goalTarget > 0 ? completedGoals / goalTarget : 0;
    const targetProgressHeight = baseHeight + (maxHeight - baseHeight) * progressRatio;

    // Stem grows with total goals, but capped by target progress
    const growthPerGoal = 12;
    const stemFromGoals = baseHeight + (totalGoals * growthPerGoal);
    const totalPlantHeight = Math.min(stemFromGoals, targetProgressHeight);

    const branchCount = completedGoals;

    // Check if target is fully achieved
    const isFullyComplete = goalTarget > 0 && completedGoals >= goalTarget;

    return (
        <div className="relative w-full h-[320px] flex items-end justify-center overflow-hidden">
            {/* The Light/Aura */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-48 h-64 bg-blue-400/5 blur-[60px] rounded-full pointer-events-none" />

            {/* The Pot/Base */}
            <div className="absolute bottom-0 w-24 h-2 bg-white/10 blur-[2px] rounded-full" />
            <div className="absolute bottom-0 w-16 h-1 bg-white/20 rounded-full" />

            {/* The Plant Container */}
            <motion.div
                className="relative flex items-end justify-center"
                animate={{
                    rotate: [-0.5, 0.5, -0.5],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                {/* Main Stem - height based on TOTAL goals */}
                <motion.div
                    initial={{ height: baseHeight }}
                    animate={{ height: totalPlantHeight }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="w-[2.5px] rounded-t-full bg-gradient-to-t from-white/30 via-white/20 to-transparent relative"
                >
                    <div className="absolute inset-0 w-full h-full bg-white/10 blur-[1px]" />

                    {/* Completion Crown - appears at top when all goals done */}
                    {isFullyComplete && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.5, ease: "backOut", delay: 0.5 }}
                            className="absolute -top-6 left-1/2 -translate-x-1/2"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                className="relative w-8 h-8"
                            >
                                {/* 8-pointed star */}
                                {[...Array(8)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="absolute w-1 h-4 bg-gradient-to-t from-yellow-200/80 to-yellow-100/40 rounded-full blur-[0.5px]"
                                        style={{
                                            transform: `rotate(${i * 45}deg) translateY(-6px)`,
                                            transformOrigin: 'center center',
                                            left: '50%',
                                            top: '50%',
                                            marginLeft: '-2px',
                                            marginTop: '-2px'
                                        }}
                                    />
                                ))}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-yellow-100/90 shadow-[0_0_20px_rgba(255,255,200,0.8)]" />
                            </motion.div>
                        </motion.div>
                    )}
                </motion.div>

                {/* Branches - only exist for COMPLETED goals */}
                {[...Array(branchCount)].map((_, i) => {
                    const isRight = i % 2 === 0; // Even indices go right, odd go left
                    // Distribute branches along the stem
                    const verticalPos = 40 + (i * (totalPlantHeight / (branchCount + 1)));
                    const branchWidth = Math.min(25, 20 + (i * 1)); // Max 25px to stay in card
                    const rotation = isRight ? 35 : -35;

                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scaleX: 0 }}
                            animate={{
                                opacity: 1,
                                scaleX: 1,
                            }}
                            transition={{
                                duration: 1.2,
                                ease: "backOut",
                                delay: i * 0.2
                            }}
                            style={{
                                position: 'absolute',
                                bottom: verticalPos,
                                [isRight ? 'left' : 'right']: '50%', // Position from center
                                width: branchWidth,
                                height: '2px',
                                background: `linear-gradient(${isRight ? 'to right' : 'to left'}, rgba(255,255,255,0.4), transparent)`,
                                transformOrigin: isRight ? 'left center' : 'right center',
                                transform: `rotate(${rotation}deg)`,
                            }}
                        >
                            {/* The Flower Bloom */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.15, 1],
                                    opacity: [0.6, 0.9, 0.6]
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    delay: i * 0.5
                                }}
                                className={`absolute ${isRight ? 'right-0' : 'left-0'} top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center`}
                            >
                                {/* 6 Petals arranged symmetrically */}
                                {[...Array(6)].map((_, petalIndex) => {
                                    const angle = (petalIndex * 60); // 360/6 = 60 degrees between petals
                                    return (
                                        <div
                                            key={petalIndex}
                                            className="absolute w-2 h-3.5 bg-white/40 rounded-t-full rounded-b-sm blur-[0.5px] shadow-[0_0_6px_rgba(255,255,255,0.3)]"
                                            style={{
                                                transform: `rotate(${angle}deg) translateY(-5px)`,
                                                transformOrigin: 'center bottom'
                                            }}
                                        />
                                    );
                                })}
                                {/* Center of flower */}
                                <div className="absolute w-2 h-2 rounded-full bg-white/60 shadow-[0_0_8px_white] z-10" />
                            </motion.div>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Subtle Particles - more when goals completed */}
            {[...Array(Math.max(2, completedGoals))].map((_, i) => (
                <motion.div
                    key={`dust-${i}`}
                    animate={{
                        y: [-20, -110],
                        opacity: [0, 0.3, 0]
                    }}
                    transition={{
                        duration: 6 + Math.random() * 4,
                        repeat: Infinity,
                        delay: i * 2,
                        ease: "linear"
                    }}
                    className="absolute w-1 h-1 bg-white/30 rounded-full blur-[1px]"
                    style={{
                        bottom: 40,
                        left: `${15 + (i * 20)}%`
                    }}
                />
            ))}

            {/* Full Completion Sparkles - extra celebration */}
            {isFullyComplete && [...Array(8)].map((_, i) => (
                <motion.div
                    key={`complete-sparkle-${i}`}
                    animate={{
                        y: [0, -80],
                        x: [(i - 4) * 10, (i - 4) * 20],
                        opacity: [0, 1, 0],
                        scale: [0, 1.5, 0]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.4,
                        ease: "easeOut"
                    }}
                    className="absolute w-1.5 h-1.5 bg-yellow-200/90 rounded-full"
                    style={{ bottom: '50%', left: '50%' }}
                />
            ))}
        </div>
    );
};

export default GrowthVisualizer;
