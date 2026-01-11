import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveToStorage, loadFromStorage } from '../../utils/storage';

const INTENTIONS_KEY = 'bloomroom_intentions';

const IntentionsList = ({ lightText = true }) => {
    const [intentions, setIntentions] = useState(() => loadFromStorage(INTENTIONS_KEY, []));
    const [isAdding, setIsAdding] = useState(false);
    const [newIntention, setNewIntention] = useState('');

    useEffect(() => {
        saveToStorage(INTENTIONS_KEY, intentions);
    }, [intentions]);

    const handleAdd = (e) => {
        e.preventDefault();
        if (newIntention.trim() && intentions.length < 5) {
            setIntentions([...intentions, { id: Date.now(), text: newIntention.trim() }]);
            setNewIntention('');
            setIsAdding(false);
        }
    };

    const handleDelete = (id) => {
        setIntentions(intentions.filter(i => i.id !== id));
    };

    const textColor = lightText ? 'text-cream-50' : 'text-slate-800';

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className={`text-xs tracking-[0.3em] uppercase font-light ${lightText ? 'text-cream-200/40' : 'text-slate-400'}`}>
                    2026 Intentions
                </h3>
                {intentions.length < 5 && !isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-[10px] tracking-[0.2em] uppercase transition-all"
                    >
                        + Add
                    </button>
                )}
            </div>

            <AnimatePresence>
                {isAdding && (
                    <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleAdd}
                        className="space-y-3"
                    >
                        <input
                            autoFocus
                            type="text"
                            value={newIntention}
                            onChange={(e) => setNewIntention(e.target.value)}
                            placeholder="I intend to..."
                            className={`w-full bg-white/5 border border-white/20 rounded-2xl px-6 py-4 ${textColor} font-light focus:outline-none focus:ring-2 focus:ring-white/30 placeholder:text-white/30`}
                        />
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setIsAdding(false)}
                                className="flex-1 py-3 text-white/60 hover:text-white text-xs tracking-[0.3em] uppercase transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 py-3 bg-white/20 hover:bg-white/30 text-white rounded-2xl text-xs tracking-[0.3em] uppercase transition-all"
                            >
                                Add
                            </button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            <div className="space-y-4">
                {intentions.length === 0 ? (
                    <div className="py-12 text-center opacity-40">
                        <p className={`${textColor} font-light italic text-sm`}>
                            Set your intentions for 2026
                        </p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {intentions.map((intention, index) => (
                            <motion.div
                                key={intention.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group relative"
                            >
                                <div className="flex items-start gap-4">
                                    <span className="text-2xl font-extralight text-white/40 min-w-[2rem]">
                                        {index + 1}.
                                    </span>
                                    <p className={`${textColor} font-light text-lg flex-1 leading-relaxed`}>
                                        {intention.text}
                                    </p>
                                    <button
                                        onClick={() => handleDelete(intention.id)}
                                        className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-red-400 transition-all"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            {intentions.length > 0 && intentions.length < 5 && (
                <p className="text-[10px] text-white/40 text-center italic">
                    {5 - intentions.length} more intention{5 - intentions.length !== 1 ? 's' : ''} available
                </p>
            )}
        </div>
    );
};

export default IntentionsList;
