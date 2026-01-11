import { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/appContextCore';
import { getAIResponse, formatAIResponse } from '../../utils/aiResponses';
import Button from '../Button';

const MindDump = ({ lightText = false }) => {
    const { addMindDump, mindDumps } = useApp();
    const [input, setInput] = useState('');
    const [currentResponse, setCurrentResponse] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const subTextColor = lightText ? 'text-cream-200/60' : 'text-slate-500';

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        setIsProcessing(true);
        // Start "shredding" effect
        setTimeout(() => {
            const response = getAIResponse(input);
            const formattedResponse = formatAIResponse(response);
            setCurrentResponse(formattedResponse);
            addMindDump(input, formattedResponse);
            setInput('');
            setIsProcessing(false);
        }, 2500); // Longer delay for the cool animation
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
                {!currentResponse ? (
                    <motion.div
                        key="input"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{
                            opacity: 0,
                            y: 100,
                            scale: 0.5,
                            filter: 'blur(10px)',
                            transition: { duration: 2, ease: "easeIn" }
                        }}
                        className="bg-white/10 backdrop-blur-xl p-8 rounded-[2rem] border border-white/20 shadow-xl relative overflow-hidden"
                    >
                        {isProcessing && (
                            <motion.div
                                className="absolute inset-0 z-10 bg-white/5 pointer-events-none"
                                initial={{ y: "0%" }}
                                animate={{ y: "100%" }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                style={{
                                    background: 'linear-gradient(transparent, rgba(255,255,255,0.2), transparent)',
                                    height: '50%'
                                }}
                            />
                        )}
                        <form onSubmit={handleSubmit}>
                            <label className={`block text-sm tracking-[0.2em] uppercase font-light ${subTextColor} mb-6 text-center`}>
                                What's weighing on you?
                            </label>
                            <motion.textarea
                                animate={isProcessing ? {
                                    x: [0, -1, 1, -1, 1, 0],
                                    opacity: [1, 0.8, 1],
                                    transition: { duration: 0.2, repeat: Infinity }
                                } : {}}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Let it all out. This space is yours..."
                                className={`w-full h-48 bg-white/10 border-none rounded-2xl p-6 font-light text-lg focus:ring-2 focus:ring-white/10 outline-none transition-all placeholder:text-white/20 ${lightText ? 'text-white' : 'text-slate-700'}`}
                                disabled={isProcessing}
                            />
                            <div className="mt-8 flex justify-center">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={!input.trim() || isProcessing}
                                    className={lightText ? '!bg-white/20 !text-white' : '!bg-sage-600'}
                                >
                                    {isProcessing ? 'Processing...' : 'Release & Forget'}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div
                        key="response"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                    >
                        {[
                            { icon: '🌸', text: currentResponse.reassurance, delay: 0 },
                            { icon: '🌿', text: currentResponse.grounding, delay: 0.2 },
                            { icon: '✨', text: currentResponse.nextStep, delay: 0.4 }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: item.delay }}
                                className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20"
                            >
                                <div className="flex gap-4 items-start">
                                    <span className="text-xl">{item.icon}</span>
                                    <p className={`${lightText ? 'text-cream-100' : 'text-slate-700'} font-light leading-relaxed`}>{item.text}</p>
                                </div>
                            </motion.div>
                        ))}

                        <div className="flex justify-center mt-12">
                            <button
                                onClick={() => setCurrentResponse(null)}
                                className={`text-xs tracking-[0.3em] uppercase font-light ${subTextColor} hover:text-white transition-colors`}
                            >
                                Share more
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default MindDump;
