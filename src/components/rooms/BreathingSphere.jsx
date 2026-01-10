import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';

const BreathingSphere = () => {
    const [phase, setPhase] = useState('Inhale');

    useEffect(() => {
        const interval = setInterval(() => {
            setPhase(p => p === 'Inhale' ? 'Exhale' : 'Inhale');
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center p-12">
            <div className="relative flex items-center justify-center w-64 h-64">
                {/* Outer Glows */}
                <motion.div
                    animate={{
                        scale: phase === 'Inhale' ? 1.2 : 0.8,
                        opacity: phase === 'Inhale' ? 0.4 : 0.1
                    }}
                    transition={{ duration: 4, ease: "easeInOut" }}
                    className="absolute inset-0 bg-sage-200 rounded-full blur-3xl shadow-[0_0_50px_rgba(165,180,167,0.3)]"
                />

                {/* The Sphere */}
                <motion.div
                    animate={{
                        scale: phase === 'Inhale' ? 1.1 : 0.7,
                    }}
                    transition={{ duration: 4, ease: "easeInOut" }}
                    className="relative w-40 h-40 bg-gradient-to-br from-sage-100 to-sage-300 rounded-full shadow-inner flex items-center justify-center border border-white/50"
                >
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={phase}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-[10px] tracking-[0.5em] uppercase font-extralight text-sage-800"
                        >
                            {phase}
                        </motion.span>
                    </AnimatePresence>
                </motion.div>
            </div>

            <p className="mt-12 text-xs tracking-[0.3em] uppercase font-light text-sage-600 opacity-60">
                Sync your breath with the sphere
            </p>
        </div>
    );
};

export default BreathingSphere;
