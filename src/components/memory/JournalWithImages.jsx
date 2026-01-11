import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveToStorage, loadFromStorage } from '../../utils/storage';

const JOURNAL_KEY = 'bloomroom_journal';

const JournalWithImages = ({ lightText = true }) => {
    const [entries, setEntries] = useState(() => loadFromStorage(JOURNAL_KEY, []));
    const [isAdding, setIsAdding] = useState(false);
    const [newEntry, setNewEntry] = useState({ text: '', image: null, imagePreview: null });

    useEffect(() => {
        saveToStorage(JOURNAL_KEY, entries);
    }, [entries]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewEntry({ ...newEntry, image: reader.result, imagePreview: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newEntry.text.trim()) {
            const entry = {
                id: Date.now().toString(),
                text: newEntry.text,
                image: newEntry.image,
                date: new Date().toISOString(),
                isFavorite: false
            };
            setEntries([entry, ...entries]);
            setNewEntry({ text: '', image: null, imagePreview: null });
            setIsAdding(false);
        }
    };

    const toggleFavorite = (id) => {
        setEntries(entries.map(e => e.id === id ? { ...e, isFavorite: !e.isFavorite } : e));
    };

    const deleteEntry = (id) => {
        if (confirm('Delete this memory?')) {
            setEntries(entries.filter(e => e.id !== id));
        }
    };

    const textColor = lightText ? 'text-cream-50' : 'text-slate-800';

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className={`text-xs tracking-[0.3em] uppercase font-light ${lightText ? 'text-cream-200/40' : 'text-slate-400'}`}>
                    Journal
                </h3>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className={`px-4 py-2 rounded-full text-[10px] tracking-[0.2em] uppercase transition-all ${isAdding ? 'bg-white/20 text-white' : 'bg-white/5 hover:bg-white/10 text-white/60'
                        }`}
                >
                    {isAdding ? 'Cancel' : '+ New Entry'}
                </button>
            </div>

            {/* Add Entry Form */}
            <AnimatePresence>
                {isAdding && (
                    <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleSubmit}
                        className="bg-white/5 backdrop-blur-sm p-6 rounded-3xl border border-white/10 space-y-4"
                    >
                        <textarea
                            autoFocus
                            value={newEntry.text}
                            onChange={(e) => setNewEntry({ ...newEntry, text: e.target.value })}
                            placeholder="What's on your mind today?"
                            className={`w-full bg-white/5 rounded-2xl p-4 font-light ${textColor} text-sm border border-white/10 outline-none focus:ring-1 focus:ring-white/20 h-32 resize-none placeholder:text-white/30`}
                        />

                        {/* Image Upload */}
                        <div>
                            <label className="block mb-2 text-xs text-white/60 tracking-wider uppercase">Add Image (Optional)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                id="journal-image-upload"
                            />
                            <label
                                htmlFor="journal-image-upload"
                                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-2xl text-xs text-white/80 transition-all"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Choose Image
                            </label>
                        </div>

                        {/* Image Preview */}
                        {newEntry.imagePreview && (
                            <div className="relative">
                                <img
                                    src={newEntry.imagePreview}
                                    alt="Preview"
                                    className="w-full h-48 object-cover rounded-2xl"
                                />
                                <button
                                    type="button"
                                    onClick={() => setNewEntry({ ...newEntry, image: null, imagePreview: null })}
                                    className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all"
                                >
                                    ×
                                </button>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs tracking-[0.3em] uppercase transition-all"
                        >
                            Save Entry
                        </button>
                    </motion.form>
                )}
            </AnimatePresence>

            {/* Entries List */}
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {entries.length === 0 ? (
                    <div className="py-12 text-center opacity-40">
                        <p className={`font-light italic text-sm ${textColor}`}>
                            No entries yet. Start journaling your memories.
                        </p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {entries.map((entry) => (
                            <motion.div
                                key={entry.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white/5 backdrop-blur-sm p-6 rounded-3xl border border-white/10 hover:bg-white/10 transition-all group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">
                                            {new Date(entry.date).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => toggleFavorite(entry.id)}
                                            className={`transition-all ${entry.isFavorite ? 'text-yellow-400' : 'text-white/40 hover:text-yellow-400'}`}
                                        >
                                            <svg className="w-5 h-5" fill={entry.isFavorite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => deleteEntry(entry.id)}
                                            className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-red-400 transition-all"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {entry.image && (
                                    <img
                                        src={entry.image}
                                        alt="Memory"
                                        className="w-full h-64 object-cover rounded-2xl mb-4"
                                    />
                                )}

                                <p className={`${textColor} font-light leading-relaxed whitespace-pre-wrap`}>
                                    {entry.text}
                                </p>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default JournalWithImages;
