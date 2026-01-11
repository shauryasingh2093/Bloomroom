import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProfiles, createProfile, setActiveProfile, deleteProfile } from '../utils/profileManager';

const ProfileSelector = ({ onProfileSelected }) => {
    const [profiles, setProfiles] = useState(getProfiles());
    const [isCreating, setIsCreating] = useState(false);
    const [newProfileName, setNewProfileName] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState('🌸');

    const avatars = ['🌸', '🌺', '🌻', '🌷', '🌹', '🪷', '🌼', '💐', '🌿', '🍀', '🌱', '🌾'];

    const handleCreateProfile = (e) => {
        e.preventDefault();
        if (newProfileName.trim()) {
            const profile = createProfile(newProfileName, selectedAvatar);
            setActiveProfile(profile.id);
            onProfileSelected(profile);
        }
    };

    const handleSelectProfile = (profile) => {
        setActiveProfile(profile.id);
        onProfileSelected(profile);
    };

    const handleDeleteProfile = (profileId, e) => {
        e.stopPropagation();
        if (profiles.length === 1) {
            alert('Cannot delete the last profile');
            return;
        }
        if (confirm('Are you sure you want to delete this profile? All data will be lost.')) {
            deleteProfile(profileId);
            setProfiles(getProfiles());
        }
    };

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-planning-dusk via-future-dusk to-care-dusk flex items-center justify-center p-4 sm:p-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-4xl"
            >
                <div className="text-center mb-12">
                    <h1 className="text-4xl sm:text-6xl font-extralight tracking-[0.3em] text-cream-50 uppercase mb-4">
                        Bloomroom
                    </h1>
                    <p className="text-cream-200/60 tracking-[0.2em] uppercase text-xs font-light">
                        Choose your space
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {isCreating ? (
                        <motion.form
                            key="create"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            onSubmit={handleCreateProfile}
                            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[3rem] p-8 sm:p-12 max-w-md mx-auto"
                        >
                            <h2 className="text-2xl font-light text-cream-50 mb-8 text-center">Create Profile</h2>

                            <div className="mb-6">
                                <label className="block text-cream-200/60 text-xs tracking-widest uppercase mb-3">Your Name</label>
                                <input
                                    autoFocus
                                    type="text"
                                    value={newProfileName}
                                    onChange={(e) => setNewProfileName(e.target.value)}
                                    placeholder="Enter your name"
                                    className="w-full bg-white/5 border border-white/20 rounded-2xl px-6 py-4 text-cream-50 text-center text-xl font-light focus:outline-none focus:ring-2 focus:ring-white/30 placeholder:text-white/30"
                                />
                            </div>

                            <div className="mb-8">
                                <label className="block text-cream-200/60 text-xs tracking-widest uppercase mb-3">Choose Avatar</label>
                                <div className="grid grid-cols-6 gap-3">
                                    {avatars.map(avatar => (
                                        <button
                                            key={avatar}
                                            type="button"
                                            onClick={() => setSelectedAvatar(avatar)}
                                            className={`text-3xl p-3 rounded-2xl transition-all ${selectedAvatar === avatar
                                                ? 'bg-white/30 scale-110'
                                                : 'bg-white/5 hover:bg-white/10'
                                                }`}
                                        >
                                            {avatar}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsCreating(false)}
                                    className="flex-1 py-4 text-white/60 hover:text-white text-xs tracking-[0.3em] uppercase transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-4 bg-white/20 hover:bg-white/30 text-white rounded-2xl text-xs tracking-[0.3em] uppercase transition-all"
                                >
                                    Create
                                </button>
                            </div>
                        </motion.form>
                    ) : (
                        <motion.div
                            key="select"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {profiles.map((profile) => (
                                <motion.div
                                    key={profile.id}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleSelectProfile(profile)}
                                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-all group relative cursor-pointer"
                                >
                                    <button
                                        onClick={(e) => handleDeleteProfile(profile.id, e)}
                                        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-white/40 hover:text-red-400 transition-all z-10"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                    <div className="text-5xl mb-4">{profile.avatar}</div>
                                    <h3 className="text-xl font-light text-cream-50 mb-2">{profile.name}</h3>
                                    <p className="text-[10px] text-cream-200/40 tracking-widest uppercase">
                                        Last active: {new Date(profile.lastActive).toLocaleDateString()}
                                    </p>
                                </motion.div>
                            ))}

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsCreating(true)}
                                className="bg-white/5 backdrop-blur-md border-2 border-dashed border-white/20 rounded-3xl p-8 hover:bg-white/10 hover:border-white/30 transition-all flex flex-col items-center justify-center min-h-[200px]"
                            >
                                <div className="text-5xl mb-4 opacity-60">+</div>
                                <p className="text-cream-200/60 text-xs tracking-[0.3em] uppercase">New Profile</p>
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default ProfileSelector;
