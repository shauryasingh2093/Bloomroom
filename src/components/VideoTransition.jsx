// Video Transition Component
// Plays room-specific transition videos when entering rooms
import { useState, useEffect, useRef, useCallback } from 'react';
import { getVideoConfig } from '../config/roomVideos';
import './VideoTransition.css';

const VideoTransition = ({ roomId, isActive, onComplete }) => {
    const [transitionState, setTransitionState] = useState('idle'); // idle, loading, playing, fading-out
    const [videoError, setVideoError] = useState(false);
    const videoRef = useRef(null);

    const roomConfig = getVideoConfig(roomId);

    const handleComplete = useCallback(() => {
        setTransitionState('fading-out');

        // Wait for fade-out animation
        setTimeout(() => {
            setTransitionState('idle');
            if (onComplete) {
                onComplete();
            }
        }, 600); // Match CSS transition duration
    }, [onComplete]);

    useEffect(() => {
        if (isActive && roomConfig) {
            // Deferred to avoid synchronous setState in effect (Vite/React lint)
            const timer = setTimeout(() => {
                setTransitionState('loading');
                setVideoError(false);

                // If no video path, trigger fallback timeout immediately
                if (!roomConfig.videoPath) {
                    setVideoError(true);
                    const fallbackTimer = setTimeout(() => {
                        handleComplete();
                    }, 2500); // Give user time to see the fallback
                    return () => clearTimeout(fallbackTimer);
                }
            }, 0);
            return () => clearTimeout(timer);
        } else {
            const timer = setTimeout(() => {
                setTransitionState('idle');
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [isActive, roomConfig, handleComplete]);

    const handleVideoLoaded = () => {
        setTransitionState('playing');
        if (videoRef.current) {
            videoRef.current.play().catch(() => {
                // If autoplay fails, use fallback
                setVideoError(true);
            });
        }
    };

    const handleVideoEnded = () => {
        handleComplete();
    };

    const handleVideoError = () => {
        setVideoError(true);
        // Show fallback for 2 seconds then complete
        setTimeout(() => {
            handleComplete();
        }, 2000);
    };

    // Helper function to darken a color
    const adjustColor = (color, amount) => {
        if (!color) return '#000000';
        const hex = color.replace('#', '');
        const num = parseInt(hex, 16);
        const r = Math.max(0, Math.min(255, (num >> 16) + amount));
        const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
        const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
        return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    };

    // Helper function to get room-specific icons
    const getRoomIcon = (roomId) => {
        const icons = {
            'entry': '🏠',
            'planning': '📋',
            'calm': '🌊',
            'future': '🌅',
            'care': '💚',
            'memory': '📖'
        };
        return icons[roomId] || '🚪';
    };

    if (!isActive || transitionState === 'idle') {
        return null;
    }

    const overlayClass = `video-transition-overlay ${transitionState === 'playing' || transitionState === 'loading' ? 'active' : ''} ${transitionState === 'fading-out' ? 'fading-out' : ''}`;

    return (
        <div className={overlayClass}>
            {!videoError && roomConfig?.videoPath ? (
                <>
                    <video
                        ref={videoRef}
                        className="transition-video"
                        src={roomConfig.videoPath}
                        onLoadedData={handleVideoLoaded}
                        onEnded={handleVideoEnded}
                        onError={handleVideoError}
                        playsInline
                        muted
                        preload="auto"
                    />
                    {transitionState === 'loading' && (
                        <div className="video-loading">Loading...</div>
                    )}
                </>
            ) : roomConfig ? (
                <div
                    className="video-fallback fade-in"
                    style={{
                        '--fallback-color': roomConfig.fallbackColor,
                        '--fallback-color-dark': adjustColor(roomConfig.fallbackColor, -20)
                    }}
                >
                    <div className="fallback-content">
                        <div className="fallback-icon">
                            {getRoomIcon(roomConfig.id)}
                        </div>
                        <h2 className="fallback-title">{roomConfig.name}</h2>
                        <p className="fallback-description">{roomConfig.description}</p>
                    </div>
                </div>
            ) : null}

            {/* Skip Button */}
            {(transitionState === 'playing' || transitionState === 'loading') && (
                <button
                    onClick={handleComplete}
                    className="fixed bottom-6 right-6 px-8 py-4 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-full text-sm tracking-[0.25em] uppercase transition-all shadow-2xl z-50 font-medium"
                >
                    Skip
                </button>
            )}
        </div>
    );
};

export default VideoTransition;
