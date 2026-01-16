import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadQuickNotesFromDB, saveQuickNote, deleteQuickNote } from '../../utils/supabaseData';
import { useAuth } from '../../context/AuthContext';

const QuickNotes = ({ lightText = false }) => {
    const { user } = useAuth();
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Load notes from Supabase
    useEffect(() => {
        const loadData = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const data = await loadQuickNotesFromDB();
                setNotes(data);
            } catch (error) {
                console.error('Error loading quick notes:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [user]);

    const addNote = async (e) => {
        e.preventDefault();
        if (!newNote.trim()) return;
        if (!user) {
            alert('Please sign in to add notes');
            return;
        }

        try {
            setSaving(true);
            await saveQuickNote(newNote.trim());

            // Reload notes
            const data = await loadQuickNotesFromDB();
            setNotes(data);
            setNewNote('');
            setIsAdding(false);
        } catch (error) {
            console.error('Error adding note:', error);
            alert('Failed to add note. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const deleteNote = async (id) => {
        try {
            await deleteQuickNote(id);

            // Reload notes
            const data = await loadQuickNotesFromDB();
            setNotes(data);
        } catch (error) {
            console.error('Error deleting note:', error);
            alert('Failed to delete note. Please try again.');
        }
    };

    const textColor = lightText ? 'text-cream-50' : 'text-slate-800';
    const subTextColor = lightText ? 'text-cream-200/60' : 'text-slate-600';

    return (
        <div className="bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-[2.5rem] border border-white/20">
            <div className="flex justify-between items-center mb-6">
                <h3 className={`text-[10px] tracking-[0.3em] uppercase font-light ${lightText ? 'text-cream-200/40' : 'text-slate-400'}`}>
                    Quick Notes
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
                        onSubmit={addNote}
                        className="mb-6"
                    >
                        <input
                            autoFocus
                            type="text"
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            placeholder="Quick thought..."
                            className={`w-full bg-white/5 rounded-2xl p-4 font-light ${textColor} text-sm border border-white/10 outline-none focus:ring-1 focus:ring-white/20 placeholder:text-white/30`}
                        />
                        <button
                            type="submit"
                            className="mt-3 w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-[10px] tracking-[0.3em] uppercase transition-all"
                        >
                            Save Note
                        </button>
                    </motion.form>
                )}
            </AnimatePresence>

            <div className="space-y-3 max-h-80 overflow-y-auto">
                {notes.length === 0 ? (
                    <div className="py-8 text-center opacity-40">
                        <p className={`font-light italic text-xs ${subTextColor}`}>
                            No notes yet. Capture your thoughts.
                        </p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {notes.map((note) => (
                            <motion.div
                                key={note.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group"
                            >
                                <div className="flex justify-between items-start gap-3">
                                    <p className={`${textColor} font-light text-sm flex-1`}>
                                        {note.text}
                                    </p>
                                    <button
                                        onClick={() => deleteNote(note.id)}
                                        className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-white transition-all"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default QuickNotes;
