import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const PlanningAmbient = ({ lightText = true }) => {
    const [currentSound, setCurrentSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const audioRef = useRef(null);

    const sounds = [
        { id: 'rain', name: 'Rain', icon: '🌧️', url: '/sounds/calming-rain-257596.mp3' },
        { id: 'brown-noise', name: 'Brown Noise', icon: '🟫', url: '/sounds/soft-brown-noise-299934.mp3' },
        { id: 'waves', name: 'Waves', icon: '🌊', url: '/sounds/soft-waves-on-the-beach-sound-190884.mp3' }
    ];

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const handleSoundSelect = (sound) => {
        if (currentSound?.id === sound.id) {
            if (isPlaying) {
                audioRef.current?.pause();
                setIsPlaying(false);
            } else {
                audioRef.current?.play();
                setIsPlaying(true);
            }
        } else {
            setCurrentSound(sound);
            setIsPlaying(true);
            if (audioRef.current) {
                audioRef.current.src = sound.url;
                audioRef.current.play();
            }
        }
    };

    const textColor = lightText ? 'text-cream-50' : 'text-slate-800';
    const subTextColor = lightText ? 'text-cream-200/60' : 'text-slate-600';

    return (
        <div className="space-y-4">
            <h3 className={`text-[10px] tracking-[0.3em] uppercase font-light ${lightText ? 'text-cream-200/40' : 'text-slate-400'} text-center`}>
                Focus Sounds
            </h3>

            <div className="grid grid-cols-3 gap-3">
                {sounds.map((sound) => (
                    <button
                        key={sound.id}
                        onClick={() => handleSoundSelect(sound)}
                        className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-300 ${currentSound?.id === sound.id && isPlaying
                            ? 'bg-white/20 text-white shadow-md'
                            : 'bg-white/5 text-white/40 hover:bg-white/10'
                            }`}
                    >
                        <span className="text-xl">{sound.icon}</span>
                        <span className="text-[9px] tracking-widest uppercase font-light text-center">
                            {sound.name}
                        </span>
                    </button>
                ))}
            </div>

            {isPlaying && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2 pt-2"
                >
                    <div className="flex items-center justify-between px-1">
                        <span className={`text-[9px] ${subTextColor} tracking-widest uppercase`}>Volume</span>
                        <span className={`text-[9px] ${textColor}`}>{Math.round(volume * 100)}%</span>
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

            <audio ref={audioRef} loop />
        </div>
    );
};

export default PlanningAmbient;
