import React, { useState, useEffect } from 'react';
import RoomWrapper from '../components/RoomWrapper';
import CalendarView from '../components/common/CalendarView';
import { useApp } from '../context/appContextCore';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isSameDay } from 'date-fns';
import { uploadImage, deleteImage } from '../utils/supabaseStorage';
import { loadJournalEntries, saveJournalEntry } from '../utils/supabaseData';
import { useAuth } from '../context/AuthContext';

const MemoryCorner = ({ onBack }) => {
    const { user } = useAuth();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [journalEntries, setEntries] = useState([]);
    const [currentEntry, setCurrentEntry] = useState('');
    const [currentImage, setCurrentImage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Load journal entries from Supabase on mount
    useEffect(() => {
        const loadEntries = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const entries = await loadJournalEntries();
                // Convert Supabase format to component format
                const formattedEntries = entries.map(e => ({
                    id: e.id,
                    text: e.text,
                    image: e.image_url ? { url: e.image_url, path: e.image_path } : null,
                    date: e.entry_date,
                    isFavorite: e.is_favorite
                }));
                setEntries(formattedEntries);
            } catch (error) {
                console.error('Error loading journal entries:', error);
            } finally {
                setLoading(false);
            }
        };

        loadEntries();
    }, [user]);

    // Load entry when date changes
    useEffect(() => {
        const entry = journalEntries.find(e => isSameDay(new Date(e.date), selectedDate));
        if (entry) {
            setCurrentEntry(entry.text || '');
            setCurrentImage(entry.image);
            setIsEditing(false);
        } else {
            setCurrentEntry('');
            setCurrentImage(null);
            setIsEditing(true);
        }
    }, [selectedDate, journalEntries]);

    const handleSave = async () => {
        if (!currentEntry.trim() && !currentImage) return;
        if (!user) {
            alert('Please sign in to save journal entries');
            return;
        }

        try {
            setSaving(true);
            const dateStr = format(selectedDate, 'yyyy-MM-dd');

            // Save to Supabase
            await saveJournalEntry(dateStr, currentEntry, currentImage);

            // Reload entries to get updated data
            const entries = await loadJournalEntries();
            const formattedEntries = entries.map(e => ({
                id: e.id,
                text: e.text,
                image: e.image_url ? { url: e.image_url, path: e.image_path } : null,
                date: e.entry_date,
                isFavorite: e.is_favorite
            }));
            setEntries(formattedEntries);
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving journal entry:', error);
            alert('Failed to save entry. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!user) {
            alert('Please sign in to upload images');
            return;
        }

        try {
            setUploading(true);
            const dateStr = format(selectedDate, 'yyyy-MM-dd');
            const { url, path } = await uploadImage(file, 'journal', `${dateStr}-${Date.now()}`);
            const imageData = { url, path };
            setCurrentImage(imageData);

            // Auto-save after image upload
            await saveJournalEntry(dateStr, currentEntry, imageData);

            // Reload entries to show updated data
            const entries = await loadJournalEntries();
            const formattedEntries = entries.map(e => ({
                id: e.id,
                text: e.text,
                image: e.image_url ? { url: e.image_url, path: e.image_path } : null,
                date: e.entry_date,
                isFavorite: e.is_favorite
            }));
            setEntries(formattedEntries);
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteEntry = async () => {
        if (!window.confirm('Are you sure you want to delete this journal entry? This action cannot be undone.')) {
            return;
        }

        try {
            const dateStr = format(selectedDate, 'yyyy-MM-dd');
            const entry = journalEntries.find(e => e.date === dateStr);

            if (entry && entry.id) {
                const { deleteJournalEntry } = await import('../utils/supabaseData');
                await deleteJournalEntry(entry.id);

                // Reload entries
                const entries = await loadJournalEntries();
                const formattedEntries = entries.map(e => ({
                    id: e.id,
                    text: e.text,
                    image: e.image_url ? { url: e.image_url, path: e.image_path } : null,
                    date: e.entry_date,
                    isFavorite: e.is_favorite
                }));
                setEntries(formattedEntries);

                // Clear current entry
                setCurrentEntry('');
                setCurrentImage(null);
                setIsEditing(true);
            }
        } catch (error) {
            console.error('Error deleting entry:', error);
            alert('Failed to delete entry. Please try again.');
        }
    };

    return (
        <RoomWrapper
            title="Memory Corner"
            onBack={onBack}
            colorClass="bg-[#574964]"
            lightText={true}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[calc(100vh-12rem)]">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">

                    {/* Left Column: Calendar & Navigation */}
                    <div className="lg:col-span-4 flex flex-col gap-8">
                        <CalendarView
                            selectedDate={selectedDate}
                            onDateSelect={setSelectedDate}
                            journalEntries={journalEntries}
                        />

                        {/* Stats / Info Card */}
                        <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 flex-1">
                            <h3 className="text-xs tracking-[0.3em] uppercase font-light text-cream-200/60 mb-6">
                                Journey Stats
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-white/5 rounded-2xl text-center">
                                    <span className="block text-2xl font-light text-cream-50">{journalEntries.length}</span>
                                    <span className="text-[10px] uppercase tracking-widest text-cream-200/40">Entries</span>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl text-center">
                                    <span className="block text-2xl font-light text-cream-50">
                                        {journalEntries.filter(e => e.image).length}
                                    </span>
                                    <span className="text-[10px] uppercase tracking-widest text-cream-200/40">Photos</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: The Diary */}
                    <div className="lg:col-span-8 h-full">
                        <div className="bg-cream-50/10 backdrop-blur-xl h-full rounded-[3rem] border border-white/20 p-8 sm:p-12 relative overflow-hidden shadow-2xl flex flex-col">
                            {/* Paper Texture Overlay */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")` }}
                            />

                            {/* Diary Header */}
                            <div className="flex justify-between items-end border-b border-cream-50/20 pb-6 mb-6">
                                <div>
                                    <h2 className="text-4xl sm:text-5xl font-serif text-cream-50 mb-2">
                                        {format(selectedDate, 'dd')}
                                    </h2>
                                    <p className="text-cream-100 uppercase tracking-[0.2em] font-light text-sm">
                                        {format(selectedDate, 'MMMM yyyy, EEEE')}
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    {!isEditing ? (
                                        <>
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-xs uppercase tracking-[0.2em] text-cream-50 transition-all border border-white/10"
                                            >
                                                Edit Entry
                                            </button>
                                            {(currentEntry || currentImage) && (
                                                <button
                                                    onClick={handleDeleteEntry}
                                                    className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-full text-xs uppercase tracking-[0.2em] text-red-200 transition-all border border-red-400/30"
                                                >
                                                    Delete Entry
                                                </button>
                                            )}
                                        </>
                                    ) : (
                                        <button
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="px-6 py-2 bg-cream-50 text-planning-dusk hover:bg-white rounded-full text-xs uppercase tracking-[0.2em] transition-all shadow-lg font-medium disabled:opacity-50"
                                        >
                                            {saving ? 'Saving...' : 'Save Entry'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Diary Content Area */}
                            <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                                <AnimatePresence mode="wait">
                                    {isEditing ? (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="h-full flex flex-col gap-6"
                                        >
                                            {/* Image Upload Area */}
                                            <div className="relative group cursor-pointer">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                                                />
                                                {currentImage ? (
                                                    <div className="relative h-64 w-full rounded-2xl overflow-hidden group-hover:opacity-90 transition-opacity">
                                                        <img
                                                            src={typeof currentImage === 'string' ? currentImage : currentImage.url}
                                                            alt="Day's memory"
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <span className="text-white text-xs uppercase tracking-widest">{uploading ? 'Uploading...' : 'Change Photo'}</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="h-32 w-full border-2 border-dashed border-cream-50/20 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-cream-50/5 transition-colors">
                                                        <svg className="w-6 h-6 text-cream-200/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <span className="text-xs uppercase tracking-widest text-cream-200/60">Add a photo for today</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Text Area */}
                                            <textarea
                                                value={currentEntry}
                                                onChange={(e) => setCurrentEntry(e.target.value)}
                                                placeholder="Dear Diary, today was..."
                                                className="flex-1 w-full bg-transparent border-none outline-none text-cream-50 text-lg leading-relaxed font-light resize-none placeholder:text-cream-200/20"
                                                style={{ fontFamily: 'Georgia, serif' }}
                                                autoFocus
                                            />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="h-full flex flex-col gap-6"
                                        >
                                            {currentImage && (
                                                <div className="h-64 w-full rounded-2xl overflow-hidden shadow-lg">
                                                    <img
                                                        src={typeof currentImage === 'string' ? currentImage : currentImage.url}
                                                        alt="Day's memory"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            )}
                                            {currentEntry ? (
                                                <p className="text-cream-50 text-lg leading-relaxed font-light whitespace-pre-wrap" style={{ fontFamily: 'Georgia, serif' }}>
                                                    {currentEntry}
                                                </p>
                                            ) : (
                                                <div className="flex-1 flex items-center justify-center opacity-40">
                                                    <p className="text-cream-200 italic font-light">No entry for this day...</p>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </RoomWrapper>
    );
};

export default MemoryCorner;
