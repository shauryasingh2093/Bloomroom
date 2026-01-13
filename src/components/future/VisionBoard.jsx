import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const VisionBoard = ({ lightText = true }) => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showMeaning, setShowMeaning] = useState(false);
    const fileInputRef = useRef(null);

    // Load saved image or use default
    const [visionBoardImage, setVisionBoardImage] = useState(() => {
        return localStorage.getItem('vision_board_image') || '/vision board 2026.png';
    });

    // Check if user has uploaded a custom image
    const hasCustomImage = visionBoardImage !== '/vision board 2026.png';

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setVisionBoardImage(base64String);
                localStorage.setItem('vision_board_image', base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerUpload = () => {
        fileInputRef.current?.click();
    };

    const visionAffirmations = [
        "I am becoming the person I've always dreamed of.",
        "My future is unfolding beautifully.",
        "I trust the journey ahead.",
        "Every day brings me closer to my vision.",
        "I am worthy of all my dreams."
    ];

    const [currentAffirmation] = useState(
        visionAffirmations[Math.floor(Math.random() * visionAffirmations.length)]
    );

    const textColor = lightText ? 'text-cream-50' : 'text-slate-800';

    return (
        <div className="space-y-6">
            {/* Vision Board Display */}
            <div className="relative group">
                <div
                    className="relative overflow-hidden rounded-[2.5rem] border-2 border-white/20 bg-white/5 cursor-pointer hover:border-white/30 transition-all duration-300"
                    onClick={() => setIsFullscreen(true)}
                >
                    <img
                        src={visionBoardImage}
                        alt="2026 Vision Board"
                        className="w-full h-auto object-contain"
                        onError={(e) => {
                            e.target.src = '/paintings/Default.png';
                            e.target.alt = 'Vision Board Placeholder';
                        }}
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8 pointer-events-none">
                        <p className="text-white text-sm tracking-widest uppercase">Click to explore</p>
                    </div>
                </div>

                {/* Affirmation Overlay */}
                <AnimatePresence>
                    {showMeaning && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-[2.5rem] flex items-center justify-center p-12"
                        >
                            <p className="text-2xl sm:text-3xl font-extralight text-white text-center leading-relaxed italic">
                                "{currentAffirmation}"
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex gap-4 justify-center">
                {hasCustomImage && (
                    <button
                        onClick={() => setShowMeaning(!showMeaning)}
                        className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs tracking-[0.3em] uppercase transition-all"
                    >
                        {showMeaning ? 'Hide' : 'Read My Vision'}
                    </button>
                )}

                <button
                    onClick={triggerUpload}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs tracking-[0.3em] uppercase transition-all"
                >
                    {hasCustomImage ? 'Change Image' : 'Upload Image'}
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                />
            </div>

            {/* Fullscreen Modal */}
            <AnimatePresence>
                {isFullscreen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/95 backdrop-blur-md z-[9999] flex items-center justify-center p-4 sm:p-8"
                        onClick={() => setIsFullscreen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="relative max-w-6xl w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={visionBoardImage}
                                alt="2026 Vision Board"
                                className="w-full h-auto object-contain rounded-3xl shadow-2xl"
                                onError={(e) => {
                                    e.target.src = '/paintings/Default.png';
                                }}
                            />

                            <button
                                onClick={() => setIsFullscreen(false)}
                                className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default VisionBoard;
