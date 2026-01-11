import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProfiles, setActiveProfile, deleteProfile, updateProfile } from '../utils/profileManager';
import { useApp } from '../context/appContextCore';

const ProfileSwitcher = ({ currentProfile, onProfileChange }) => {
    const { changeUserName } = useApp();
    const [isOpen, setIsOpen] = useState(false);
    const [profiles, setProfiles] = useState(getProfiles());
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(currentProfile?.name || '');
    const [editAvatar, setEditAvatar] = useState(currentProfile?.avatarIndex || 0);
    const avatarCount = 6;

    const getAvatarStyle = (index) => {
        return {
            backgroundImage: `url('/images/a${index + 1}.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
        };
    };

    const handleSwitch = (profileId) => {
        setActiveProfile(profileId);
        const newProfile = profiles.find(p => p.id === profileId);
        changeUserName(newProfile.name); // Sync userName with profile name
        onProfileChange(newProfile);
        setIsOpen(false);
        window.location.reload(); // Reload to load new profile data
    };

    const handleDelete = (profileId) => {
        if (profiles.length <= 1) {
            alert('Cannot delete the last profile');
            return;
        }
        if (confirm('Delete this profile and all its data?')) {
            deleteProfile(profileId);
            setProfiles(getProfiles());
            if (profileId === currentProfile.id) {
                const remaining = getProfiles();
                if (remaining.length > 0) {
                    handleSwitch(remaining[0].id);
                }
            }
        }
    };

    const handleSaveEdit = () => {
        if (editName.trim()) {
            updateProfile(currentProfile.id, { name: editName.trim(), avatarIndex: editAvatar });
            changeUserName(editName.trim()); // Sync userName with profile name
            const updated = getProfiles().find(p => p.id === currentProfile.id);
            onProfileChange(updated);
            setProfiles(getProfiles());
            setIsEditing(false);
        }
    };

    return (
        <>
            {/* Profile Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-full border border-white/30 transition-all group shadow-lg"
            >
                <div
                    style={getAvatarStyle(currentProfile?.avatarIndex || 0)}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0 border-2 border-white/20"
                />
                <span className="text-sm text-white font-light hidden sm:block">{currentProfile?.name}</span>
                <svg className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Profile Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-gradient-to-br from-planning-dusk via-future-dusk to-care-dusk p-8 rounded-3xl max-w-md w-full border border-white/20"
                        >
                            <h2 className="text-2xl font-light text-white mb-6 tracking-wider">Profiles</h2>

                            {/* Current Profile Edit */}
                            {isEditing ? (
                                <div className="bg-white/10 p-6 rounded-2xl mb-6 space-y-4">
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="w-full bg-white/10 text-white px-4 py-3 rounded-xl border border-white/20 outline-none focus:ring-2 focus:ring-white/30"
                                        placeholder="Profile name"
                                    />
                                    <div className="grid grid-cols-6 gap-2">
                                        {Array.from({ length: avatarCount }).map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setEditAvatar(idx)}
                                                className={`p-2 rounded-xl transition-all ${editAvatar === idx ? 'bg-white/30 scale-110 ring-2 ring-white/50' : 'bg-white/5 hover:bg-white/20'
                                                    }`}
                                            >
                                                <div style={getAvatarStyle(idx)} className="w-full aspect-square rounded-full" />
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="flex-1 py-2 text-white/60 hover:text-white text-sm"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSaveEdit}
                                            className="flex-1 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-sm"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white/10 p-6 rounded-2xl mb-6 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div style={getAvatarStyle(currentProfile?.avatarIndex || 0)} className="w-12 h-12 rounded-full flex-shrink-0 border-2 border-white/20" />
                                        <div>
                                            <p className="text-white font-medium">{currentProfile?.name}</p>
                                            <p className="text-white/40 text-xs">Current Profile</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setEditName(currentProfile?.name || '');
                                            setEditAvatar(currentProfile?.avatarIndex || 0);
                                            setIsEditing(true);
                                        }}
                                        className="text-white/60 hover:text-white transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </button>
                                </div>
                            )}

                            {/* Other Profiles */}
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {profiles.filter(p => p.id !== currentProfile?.id).map(profile => (
                                    <div
                                        key={profile.id}
                                        className="bg-white/5 p-4 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-all"
                                    >
                                        <button
                                            onClick={() => handleSwitch(profile.id)}
                                            className="flex items-center gap-3 flex-1"
                                        >
                                            <div style={getAvatarStyle(profile.avatarIndex || 0)} className="w-12 h-12 rounded-full flex-shrink-0 border-2 border-white/20" />
                                            <div className="text-left">
                                                <p className="text-white font-light">{profile.name}</p>
                                                <p className="text-white/40 text-xs">
                                                    {new Date(profile.lastActive).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(profile.id)}
                                            className="text-white/40 hover:text-red-400 transition-colors ml-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-full mt-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm transition-all"
                            >
                                Close
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ProfileSwitcher;
