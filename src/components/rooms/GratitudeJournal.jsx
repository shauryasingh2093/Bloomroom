import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/appContextCore';

const GratitudeJournal = ({ lightText = true }) => {
    const { documentation, addDocumentation } = useApp();
    const [isAdding, setIsAdding] = useState(false);
    const [gratitudeText, setGratitudeText] = useState('');

    const gratitudeEntries = documentation.filter(doc => doc.prompt?.startsWith('Grateful for:'));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (gratitudeText.trim()) {
            addDocumentation({
                prompt: `Grateful for: ${gratitudeText}`,
                content: gratitudeText
            });
            setGratitudeText('');
            setIsAdding(false);
        }
    };

    const textColor = lightText ? 'text-cream-50' : 'text-slate-800';
    const subTextColor = lightText ? 'text-cream-200/80' : 'text-slate-600';

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className={`text-[10px] tracking-[0.3em] uppercase font-light ${lightText ? 'text-cream-200/40' : 'text-slate-400'}`}>
                    Gratitude Journal
                </h3>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className={`px-4 py-2 rounded-full text-[10px] tracking-[0.2em] uppercase transition-all ${isAdding
                            ? 'bg-white/20 text-white'
                            : 'bg-white/5 hover:bg-white/10 text-white/60'
                        }`}
                >
                    {isAdding ? 'Cancel' : '+ Add'}
                </button>
            </div>

            <AnimatePresence>
                {isAdding && (
                    <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleSubmit}
                        className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20"
                    >
                        <textarea
                            autoFocus
                            value={gratitudeText}
                            onChange={(e) => setGratitudeText(e.target.value)}
                            placeholder="What are you grateful for today?"
                            className={`w-full bg-white/5 rounded-2xl p-4 font-light ${textColor} border border-white/10 outline-none focus:ring-1 focus:ring-white/20 h-24 resize-none placeholder:text-white/30`}
                        />
                        <button
                            type="submit"
                            className="mt-4 w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-[10px] tracking-[0.3em] uppercase transition-all"
                        >
                            Save Gratitude
                        </button>
                    </motion.form>
                )}
            </AnimatePresence>

            <div className="space-y-4 max-h-96 overflow-y-auto">
                {gratitudeEntries.length === 0 ? (
                    <div className="py-12 text-center opacity-40">
                        <p className={`font-light italic text-sm ${subTextColor}`}>
                            No gratitude entries yet. Start counting your blessings.
                        </p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {gratitudeEntries.map((entry) => (
                            <motion.div
                                key={entry.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <span className={`text-[9px] tracking-[0.2em] uppercase font-light ${lightText ? 'text-cream-200/60' : 'text-slate-500'}`}>
                                        {new Date(entry.createdAt).toLocaleDateString(undefined, {
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </span>
                                    <span className="text-lg">🙏</span>
                                </div>
                                <p className={`${textColor} font-light leading-relaxed text-sm`}>
                                    {entry.content}
                                </p>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default GratitudeJournal;
