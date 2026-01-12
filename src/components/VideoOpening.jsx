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
        // Slow down video for meditative feel
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.75;
        }

        // Show button after 4.5 seconds on the opening video
        const timer = setTimeout(() => {
            setShowButton(true);
        }, 4500);

        return () => clearTimeout(timer);
    }, [currentVideo]); // Re-run if video changes, though mostly for initial load

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
            // Reset speed for entering video if needed, or keep it slow? 
            // Usually entering should be normal speed or slightly slow.
            // Let's keep it handled in the effect or next render.
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
            <div className="absolute inset-0 w-full h-full bg-black overflow-hidden">
                <video
                    ref={videoRef}
                    key={currentVideo}
                    className="absolute inset-0 w-full h-full object-cover"
                    src={currentVideo === 'opening' ? '/videos/transitions/new.mp4' : '/entering_house.mp4'}
                    autoPlay
                    muted={currentVideo === 'opening'}
                    playsInline
                    loop={currentVideo === 'opening'}
                    onEnded={handleVideoEnd}
                    style={{ minWidth: '100%', minHeight: '100%' }}
                    // Ensure playback rate is set when element mounts/updates
                    onLoadedMetadata={(e) => { e.target.playbackRate = 0.8; }}
                />

                {/* PURE CLEAR LOOK - No dark overlays at all, just the raw beautiful video */}
            </div>

            {/* Overlay with Title and Button */}
            <AnimatePresence>
                {currentVideo === 'opening' && (
                    <motion.div
                        className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-8 sm:p-12 pt-32" // Added pt-32 to lower the optical center
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                    >
                        {/* Title - Calm & Sophisticated */}
                        <AnimatePresence>
                            {showTitle && (
                                <motion.div
                                    className="text-center mb-20 relative z-10 w-full max-w-4xl"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.98, opacity: 0, filter: 'blur(10px)' }}
                                    transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }} // Ultra smooth ease
                                >
                                    <h1 className="text-5xl md:text-7xl lg:text-8xl text-white drop-shadow-sm tracking-[0.22em] leading-tight mt-2" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}>
                                        Bloomroom
                                    </h1>

                                    {/* Increased spacing */}
                                    <div className="h-px w-16 bg-white/40 mx-auto mt-10 mb-10" />

                                    <p className="text-lg md:text-xl font-medium text-white tracking-[0.15em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] opacity-100" style={{ fontFamily: "'Inter', sans-serif" }}>
                                        Your quiet space to plan, breathe, and grow
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* "Safe" Entry Button - Soft, Calm, No Bounce, Inner Shadow */}
                        <AnimatePresence>
                            {showButton && !isTransitioning && (
                                <motion.button
                                    className="group relative px-10 py-3 sm:px-14 sm:py-4 rounded-full transition-all duration-500 bg-[#F5E6DA] hover:bg-[#EBDDCF] shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),_0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),_0_8px_30px_rgba(0,0,0,0.08)]"
                                    onClick={handleEnter}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    style={{ backfaceVisibility: 'hidden' }} // Fix spacing/rendering
                                >
                                    <span className="relative z-10 text-xs md:text-sm tracking-[0.2em] uppercase font-medium text-gray-800/90 group-hover:text-gray-900 transition-colors duration-500" style={{ fontFamily: "'Inter', sans-serif" }}>
                                        Enter Home
                                    </span>
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
