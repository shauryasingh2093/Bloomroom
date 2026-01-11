import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const AmbientPlayer = ({ lightText = true }) => {
    const [currentSound, setCurrentSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const audioRef = useRef(null);

    const sounds = [
        { id: 'rain', name: 'Rain', icon: '🌧️', url: '/sounds/rain.mp3' },
        { id: 'forest', name: 'Forest', icon: '🌲', url: '/sounds/forest.mp3' },
        { id: 'piano', name: 'Piano', icon: '🎹', url: '/sounds/piano.mp3' }
    ];

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const handleSoundSelect = (sound) => {
        if (currentSound?.id === sound.id) {
            // Toggle play/pause
            if (isPlaying) {
                audioRef.current?.pause();
                setIsPlaying(false);
            } else {
                audioRef.current?.play();
                setIsPlaying(true);
            }
        } else {
            // Switch sound
            setCurrentSound(sound);
            setIsPlaying(true);
            if (audioRef.current) {
                audioRef.current.src = sound.url;
                audioRef.current.play();
            }
        }
    };

    const handleStop = () => {
        audioRef.current?.pause();
        if (audioRef.current) audioRef.current.currentTime = 0;
        setIsPlaying(false);
        setCurrentSound(null);
    };

    const textColor = lightText ? 'text-cream-50' : 'text-slate-800';
    const subTextColor = lightText ? 'text-cream-200/60' : 'text-slate-600';

    return (
        <div className="space-y-6">
            <h3 className={`text-xs tracking-[0.3em] uppercase font-light ${lightText ? 'text-cream-200/40' : 'text-slate-400'} text-center`}>
                Ambient Sounds
            </h3>

            {/* Sound Selection */}
            <div className="grid grid-cols-3 gap-4">
                {sounds.map((sound) => (
                    <button
                        key={sound.id}
                        onClick={() => handleSoundSelect(sound)}
                        className={`p-6 rounded-3xl flex flex-col items-center justify-center gap-3 transition-all duration-500 ${currentSound?.id === sound.id && isPlaying
                                ? 'bg-white/30 text-white shadow-lg scale-105'
                                : 'bg-white/5 text-cream-200/60 hover:bg-white/10'
                            }`}
                    >
                        <span className="text-3xl">{sound.icon}</span>
                        <span className={`text-[10px] tracking-widest uppercase font-light ${currentSound?.id === sound.id && isPlaying ? 'text-white' : 'text-cream-200/60'
                            }`}>
                            {sound.name}
                        </span>
                    </button>
                ))}
            </div>

            {/* Volume Control */}
            {isPlaying && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-3"
                >
                    <div className="flex items-center justify-between">
                        <span className={`text-xs ${subTextColor} tracking-widest uppercase`}>Volume</span>
                        <span className={`text-xs ${textColor}`}>{Math.round(volume * 100)}%</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                        style={{
                            background: `linear-gradient(to right, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.3) ${volume * 100}%, rgba(255,255,255,0.1) ${volume * 100}%, rgba(255,255,255,0.1) 100%)`
                        }}
                    />
                </motion.div>
            )}

            {/* Stop Button */}
            {isPlaying && (
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={handleStop}
                    className="w-full py-3 bg-white/10 hover:bg-white/20 text-white/80 rounded-2xl text-xs tracking-[0.3em] uppercase transition-all"
                >
                    Stop
                </motion.button>
            )}

            {/* Hidden Audio Element */}
            <audio ref={audioRef} loop />

            {/* Note about sounds */}
            <p className={`text-[9px] ${subTextColor} italic text-center`}>
                Note: Add sound files to /public/sounds/ directory
            </p>
        </div>
    );
};

export default AmbientPlayer;
