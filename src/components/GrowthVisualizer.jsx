import React from 'react';
import { motion } from 'framer-motion';

const GrowthVisualizer = ({ goals = [] }) => {
    // Determine plant "complexity" based on number of goals
    const goalCount = goals.length;
    const branches = Math.min(goalCount + 3, 12);

    return (
        <div className="relative w-64 h-96 mx-auto flex items-end justify-center pointer-events-none">
            {/* The Pot */}
            <div className="absolute bottom-0 w-32 h-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20 z-0" />

            {/* The Growth */}
            <div className="relative flex items-end justify-center">
                {/* Main Stem */}
                <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 120 + (goalCount * 20) }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="w-[1px] bg-gradient-to-t from-white/40 to-white/10"
                />

                {/* Branches/Leaves */}
                {[...Array(branches)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0, rotate: i % 2 === 0 ? 0 : 0 }}
                        animate={{
                            opacity: 0.4 + (i * 0.05),
                            scale: 1,
                            rotate: i % 2 === 0 ? 45 + (i * 10) : -45 - (i * 10)
                        }}
                        transition={{
                            duration: 1.5,
                            delay: 0.5 + (i * 0.2),
                            ease: "easeOut"
                        }}
                        style={{
                            position: 'absolute',
                            bottom: 20 + (i * 25),
                            left: '50%',
                            width: 60 + (i * 10),
                            height: '1px',
                            background: 'linear-gradient(to right, rgba(255,255,255,0.4), transparent)',
                            transformOrigin: 'left center'
                        }}
                    >
                        {/* Leaf Bud */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/60 blur-[1px]" />
                    </motion.div>
                ))}
            </div>

            {/* Atmosphere around the plant */}
            <div className="absolute inset-0 bg-white/5 blur-[80px] rounded-full scale-75 animate-pulse" />
        </div>
    );
};

export default GrowthVisualizer;
