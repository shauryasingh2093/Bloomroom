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
            className="fixed inset-0 w-screen h-screen overflow-hidden z-[9999]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
        >
            {/* Video Background */}
            <div className="absolute inset-0 w-full h-full bg-black">
                <motion.video
                    ref={videoRef}
                    key={currentVideo}
                    className="absolute inset-0 w-full h-full object-cover"
                    src={currentVideo === 'opening' ? '/videos/transitions/new.mp4' : '/entering_house.mp4'}
                    autoPlay
                    muted={currentVideo === 'opening'}
                    playsInline
                    loop={currentVideo === 'opening'}
                    onEnded={handleVideoEnd}
                    initial={{ scale: 1 }}
                    animate={{ scale: 1.1 }}
                    transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
                />

                {/* Cinematic Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40 mix-blend-multiply duration-1000" />
                <div className="absolute inset-0 bg-black/10 transition-colors duration-1000" />
            </div>

            {/* Overlay with Title and Button (only for opening video) */}
            <AnimatePresence>
                {currentVideo === 'opening' && (
                    <motion.div
                        className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-4"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                    >
                        {/* Title */}
                        <AnimatePresence>
                            {showTitle && (
                                <motion.div
                                    className="text-center mb-20"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                                    transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-extralight tracking-[0.3em] text-white drop-shadow-xl uppercase font-sans">
                                        Bloomroom
                                    </h1>
                                    <div className="h-px w-24 bg-white/50 mx-auto mt-8 mb-8" />
                                    <p className="text-sm md:text-lg font-light text-cream-50 tracking-[0.2em] drop-shadow-md">
                                        A soft space to plan, breathe, and grow
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Enter Button */}
                        <AnimatePresence>
                            {showButton && !isTransitioning && (
                                <motion.button
                                    className="px-12 py-4 text-sm md:text-base tracking-[0.2em] uppercase font-medium text-white/90 border border-white/20 bg-white/5 backdrop-blur-md rounded-full cursor-pointer transition-all duration-500 hover:bg-white/10 hover:border-white/40 hover:tracking-[0.25em] hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                                    onClick={handleEnter}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                                    transition={{ duration: 1.2, ease: 'easeOut' }}
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
