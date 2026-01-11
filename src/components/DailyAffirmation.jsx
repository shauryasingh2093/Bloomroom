import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const affirmations = [
    "You are capable of blooming at your own pace.",
    "Small steps lead to beautiful horizons.",
    "Your future self is proud of the work you're doing today.",
    "Give yourself permission to breathe and just be.",
    "You are the architect of your own peace.",
    "Growth is not always loud; sometimes it's a quiet unfolding.",
    "You deserve the same kindness you give to the world.",
    "Every day is a new seed for your garden of dreams."
];

const DailyAffirmation = () => {
    const [affirmation, setAffirmation] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
        setAffirmation(randomAffirmation);

        // Show after a short delay
        const timer = setTimeout(() => setIsVisible(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
                >
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 px-8 py-4 rounded-full shadow-2xl">
                        <p className="text-cream-50/70 text-[11px] tracking-[0.3em] uppercase font-light text-center flex items-center gap-4">
                            <span className="w-8 h-[1px] bg-white/20" />
                            {affirmation}
                            <span className="w-8 h-[1px] bg-white/20" />
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default DailyAffirmation;
