import React from 'react';
import { motion } from 'framer-motion';

const GrowthVisualizer = ({ goals = [] }) => {
    const totalGoals = goals.length;
    const completedGoals = goals.filter(g => g.completed).length;

    // Planting a goal grows the stem
    // Completing a goal grows a branch and adds extra height
    const baseHeight = 80;
    const stemHeight = baseHeight + (totalGoals * 20);
    const totalPlantHeight = stemHeight + (completedGoals * 30);
    const branchCount = completedGoals;

    return (
        <div className="relative w-full h-[320px] flex items-end justify-center">
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
                </motion.div>

                {/* Branches - only exist for COMPLETED goals */}
                {[...Array(branchCount)].map((_, i) => {
                    const side = i % 2 === 0 ? 1 : -1;
                    // Distribute branches along the stem
                    const verticalPos = 40 + (i * (totalPlantHeight / (branchCount + 1)));
                    const branchWidth = 45 + (i * 4);
                    const rotation = side === 1 ? 30 + (i * 5) : -30 - (i * 5);

                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0, rotate: side === 1 ? 0 : 0 }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                rotate: rotation
                            }}
                            transition={{
                                duration: 1.2,
                                ease: "backOut"
                            }}
                            style={{
                                position: 'absolute',
                                bottom: verticalPos,
                                left: '50%',
                                width: branchWidth,
                                height: '2px',
                                background: `linear-gradient(${side === 1 ? 'to right' : 'to left'}, rgba(255,255,255,0.4), transparent)`,
                                transformOrigin: side === 1 ? 'left center' : 'right center',
                                transform: side === -1 ? 'translateX(-100%)' : 'none'
                            }}
                        >
                            {/* The Bloom */}
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
                                className={`absolute ${side === 1 ? 'right-0' : 'left-0'} top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white/30 blur-[2px] border border-white/10 flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.2)]`}
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />
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
        </div>
    );
};

export default GrowthVisualizer;
