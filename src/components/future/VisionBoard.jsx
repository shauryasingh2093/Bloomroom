import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadImage, loadImageMetadata, removeImageCompletely } from '../../utils/supabaseStorage';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

const VisionBoard = ({ lightText = true }) => {
    const { user } = useAuth();
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showMeaning, setShowMeaning] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const fileInputRef = useRef(null);

    // Load saved image or use default
    const [visionBoardImage, setVisionBoardImage] = useState('/vision board 2026.png');
    const [imagePath, setImagePath] = useState(null);

    // Load image from Supabase on mount and when image changes
    useEffect(() => {
        const loadImage = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const metadata = await loadImageMetadata('vision_board_image');
                if (metadata?.url) {
                    setVisionBoardImage(metadata.url);
                    setImagePath(metadata.path);
                } else {
                    // No custom image, use default
                    setVisionBoardImage('/vision board 2026.png');
                    setImagePath(null);
                }
            } catch (error) {
                console.error('Error loading vision board image:', error);
                // On error, use default
                setVisionBoardImage('/vision board 2026.png');
                setImagePath(null);
            } finally {
                setLoading(false);
            }
        };

        loadImage();
    }, [user]); // Only depend on user, not visionBoardImage to avoid infinite loop

    // Check if user has uploaded a custom image
    const hasCustomImage = visionBoardImage !== '/vision board 2026.png';

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!user) {
            alert('Please sign in to upload images');
            return;
        }

        try {
            setUploading(true);

            // Delete old image if exists
            if (imagePath) {
                try {
                    await removeImageCompletely('vision_board_image', imagePath);
                } catch (error) {
                    console.warn('Error removing old image:', error);
                }
            }

            // Upload new image to Supabase Storage
            const { url, path } = await uploadImage(file, 'vision-board', `vision-${Date.now()}`);

            // Save metadata to user_data table
            const metadata = {
                url,
                path,
                uploaded_at: new Date().toISOString()
            };

            const { data: { user: currentUser } } = await supabase.auth.getUser();
            const { error } = await supabase.from('user_data').upsert({
                user_id: currentUser.id,
                key: 'vision_board_image',
                value: metadata,
                updated_at: new Date().toISOString()
            });

            if (error) throw error;

            setVisionBoardImage(url);
            setImagePath(path);
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = async () => {
        if (!user) return;

        try {
            setUploading(true);

            // This will remove both from storage (if path exists) AND metadata from DB
            await removeImageCompletely('vision_board_image', imagePath);

            // Update local state to show default image
            setVisionBoardImage('/vision board 2026.png');
            setImagePath(null);
            setShowMeaning(false); // Hide affirmation if it was showing

            console.log('Vision board image removed successfully');
        } catch (error) {
            console.error('Remove failed:', error);
            alert('Failed to remove image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const triggerUpload = () => {
        fileInputRef.current?.click();
    };

    const visionAffirmations = [
        "I am becoming the person I've always dreamed of.",
        "My future is unfolding beautifully.",
        "I trust the journey ahead.",
        "Every day brings me closer to my vision.",
        "I am worthy of all my dreams."
    ];

    const [currentAffirmation] = useState(
        visionAffirmations[Math.floor(Math.random() * visionAffirmations.length)]
    );

    const textColor = lightText ? 'text-cream-50' : 'text-slate-800';

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="relative overflow-hidden rounded-[2.5rem] border-2 border-white/20 bg-white/5 h-96 flex items-center justify-center">
                    <p className="text-cream-200/60 text-sm tracking-widest uppercase">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Vision Board Display */}
            <div className="relative group">
                <div
                    className="relative overflow-hidden rounded-[2.5rem] border-2 border-white/20 bg-white/5 cursor-pointer hover:border-white/30 transition-all duration-300"
                    onClick={() => setIsFullscreen(true)}
                >
                    <img
                        src={visionBoardImage}
                        alt="2026 Vision Board"
                        className="w-full h-auto object-contain"
                        onError={(e) => {
                            e.target.src = '/paintings/Default.png';
                            e.target.alt = 'Vision Board Placeholder';
                        }}
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8 pointer-events-none">
                        <p className="text-white text-sm tracking-widest uppercase">Click to explore</p>
                    </div>

                    {/* Uploading Overlay */}
                    {uploading && (
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
                            <p className="text-white text-sm tracking-widest uppercase">Uploading...</p>
                        </div>
                    )}
                </div>

                {/* Affirmation Overlay */}
                <AnimatePresence>
                    {showMeaning && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-[2.5rem] flex items-center justify-center p-12"
                        >
                            <p className="text-2xl sm:text-3xl font-extralight text-white text-center leading-relaxed italic">
                                "{currentAffirmation}"
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex gap-4 justify-center flex-wrap">
                {hasCustomImage && (
                    <button
                        onClick={() => setShowMeaning(!showMeaning)}
                        className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs tracking-[0.3em] uppercase transition-all disabled:opacity-50"
                        disabled={uploading}
                    >
                        {showMeaning ? 'Hide' : 'Read My Vision'}
                    </button>
                )}

                <button
                    onClick={triggerUpload}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs tracking-[0.3em] uppercase transition-all disabled:opacity-50"
                    disabled={uploading || !user}
                >
                    {uploading ? 'Uploading...' : hasCustomImage ? 'Change Image' : 'Upload Image'}
                </button>

                {hasCustomImage && (
                    <button
                        onClick={handleRemoveImage}
                        className="px-6 py-3 bg-white/10 hover:bg-red-500/20 text-white hover:text-red-200 rounded-2xl text-xs tracking-[0.3em] uppercase transition-all disabled:opacity-50"
                        disabled={uploading || !user}
                    >
                        Remove Image
                    </button>
                )}

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                />
            </div>

            {!user && (
                <p className="text-center text-cream-200/60 text-xs tracking-widest uppercase">
                    Sign in to upload your own vision board
                </p>
            )}

            {/* Fullscreen Modal */}
            <AnimatePresence>
                {isFullscreen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/95 backdrop-blur-md z-[9999] flex items-center justify-center p-4 sm:p-8"
                        onClick={() => setIsFullscreen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="relative max-w-6xl w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={visionBoardImage}
                                alt="2026 Vision Board"
                                className="w-full h-auto object-contain rounded-3xl shadow-2xl"
                                onError={(e) => {
                                    e.target.src = '/paintings/Default.png';
                                }}
                            />

                            <button
                                onClick={() => setIsFullscreen(false)}
                                className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default VisionBoard;
