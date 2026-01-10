import { useState, useEffect, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';

export default function VideoOpening({ onEnter }) {
    const [currentVideo, setCurrentVideo] = useState('opening'); // 'opening' or 'entering'
    const [showButton, setShowButton] = useState(false);
    const [showTitle, setShowTitle] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
        // Show button after 4.5 seconds on the opening video
        const timer = setTimeout(() => {
            setShowButton(true);
        }, 4500);

        return () => clearTimeout(timer);
    }, []);

    const handleEnter = () => {
        setIsTransitioning(true);
        setShowButton(false);

        // Fade out title
        setTimeout(() => {
            setShowTitle(false);
        }, 500);

        // Transition to entering house video
        setTimeout(() => {
            setCurrentVideo('entering');
            setIsTransitioning(false);
        }, 1500);
    };

    const handleVideoEnd = () => {
        // When entering_house.mp4 ends, transition to main app
        if (currentVideo === 'entering') {
            onEnter();
        }
    };


    return (
        <motion.div
            className="fixed inset-0 w-screen h-screen overflow-hidden z-[1000]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
        >
            {/* Video Background */}
            <video
                ref={videoRef}
                key={currentVideo}
                className="absolute inset-0 w-full h-full object-cover"
                src={currentVideo === 'opening' ? '/video1.mp4' : '/entering_house.mp4'}
                autoPlay
                muted
                playsInline
                loop={currentVideo === 'opening'}
                onEnded={handleVideoEnd}
            />

            {/* Overlay with Title and Button (only for opening video) */}
            <AnimatePresence>
                {currentVideo === 'opening' && (
                    <motion.div
                        className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-black/30 backdrop-blur-[2px]"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                    >
                        {/* Title */}
                        <AnimatePresence>
                            {showTitle && (
                                <motion.div
                                    className="text-center mb-16"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 1.5, ease: 'easeOut' }}
                                >
                                    <h1 className="text-7xl md:text-9xl font-extralight tracking-[0.2em] text-cream-50 m-0 drop-shadow-2xl uppercase">
                                        Bloomroom
                                    </h1>
                                    <div className="h-px w-24 bg-cream-200/50 mx-auto mt-8 mb-6" />
                                    <p className="text-lg md:text-xl font-light text-cream-100 tracking-[0.1em] opacity-80 drop-shadow-lg italic">
                                        A soft space to plan, breathe, and grow
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Enter Button */}
                        <AnimatePresence>
                            {showButton && !isTransitioning && (
                                <motion.button
                                    className="px-10 py-4 text-lg md:text-xl font-medium text-sage-900 bg-cream-50 rounded-full cursor-pointer shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95"
                                    onClick={handleEnter}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 1, ease: 'easeOut' }}
                                >
                                    Enter Bloomroom
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
