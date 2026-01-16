// Supabase Storage utilities for Bloomroom
// Handles image upload, download, and deletion

import { supabase } from '../lib/supabase';

/**
 * Convert base64 string to Blob
 * @param {string} base64 - Base64 encoded image
 * @returns {Blob}
 */
export const base64ToBlob = (base64) => {
    const parts = base64.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
};

/**
 * Upload image to Supabase Storage
 * @param {File|Blob} file - Image file or blob
 * @param {string} type - 'vision-board' or 'journal'
 * @param {string} filename - Optional custom filename
 * @returns {Promise<{url: string, path: string}>}
 */
export const uploadImage = async (file, type, filename = null) => {
    try {
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            throw new Error('User not authenticated');
        }

        const userId = user.id;
        const timestamp = Date.now();
        const fileExt = file.name?.split('.').pop() || 'jpg';
        const fileName = filename || `${type}-${timestamp}.${fileExt}`;
        const filePath = `${userId}/${type}/${fileName}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from('user-images')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true
            });

        if (error) throw error;

        // Get public URL
        const { data: publicUrlData } = supabase.storage
            .from('user-images')
            .getPublicUrl(filePath);

        return { url: publicUrlData.publicUrl, path: filePath };
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

/**
 * Delete image from Supabase Storage
 * @param {string} path - Storage path of the image
 * @returns {Promise<void>}
 */
export const deleteImage = async (path) => {
    try {
        if (!path) return;

        const { error } = await supabase.storage
            .from('user-images')
            .remove([path]);

        if (error) throw error;
    } catch (error) {
        console.error('Error deleting image:', error);
        throw error;
    }
};

/**
 * Get signed URL for private image (if needed)
 * @param {string} path - Storage path of the image
 * @param {number} expiresIn - Expiration time in seconds (default: 1 hour)
 * @returns {Promise<string>}
 */
export const getSignedImageUrl = async (path, expiresIn = 3600) => {
    try {
        const { data, error } = await supabase.storage
            .from('user-images')
            .createSignedUrl(path, expiresIn);

        if (error) throw error;
        return data.signedUrl;
    } catch (error) {
        console.error('Error getting signed URL:', error);
        throw error;
    }
};

/**
 * Download image as blob
 * @param {string} path - Storage path of the image
 * @returns {Promise<Blob>}
 */
export const downloadImage = async (path) => {
    try {
        const { data, error } = await supabase.storage
            .from('user-images')
            .download(path);

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error downloading image:', error);
        throw error;
    }
};

/**
 * Save image metadata to database (using user_data table)
 * @param {string} key - Storage key (e.g., 'vision_board_image')
 * @param {object} metadata - Image metadata {url, path, uploaded_at}
 * @returns {Promise<void>}
 */
export const saveImageMetadata = async (key, metadata) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            throw new Error('User not authenticated');
        }

        const { error } = await supabase
            .from('user_data')
            .upsert({
                user_id: user.id,
                key,
                value: metadata,
                updated_at: new Date().toISOString()
            });

        if (error) throw error;
    } catch (error) {
        console.error('Error saving image metadata:', error);
        throw error;
    }
};

/**
 * Load image metadata from database
 * @param {string} key - Storage key (e.g., 'vision_board_image')
 * @returns {Promise<object|null>}
 */
export const loadImageMetadata = async (key) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return null;
        }

        const { data, error } = await supabase
            .from('user_data')
            .select('value')
            .eq('user_id', user.id)
            .eq('key', key)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // No rows found
            throw error;
        }

        return data?.value || null;
    } catch (error) {
        console.error('Error loading image metadata:', error);
        return null;
    }
};

/**
 * Remove image and its metadata
 * @param {string} key - Storage key
 * @param {string} path - Storage path
 * @returns {Promise<void>}
 */
export const removeImageCompletely = async (key, path) => {
    try {
        // 1. Get current user first
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            console.error('Core error: User not authenticated for deletion');
            return;
        }

        // 2. Delete from storage (try-catch specifically for storage)
        if (path) {
            try {
                await deleteImage(path);
                console.log(`Successfully deleted image from storage: ${path}`);
            } catch (storageError) {
                // If storage deletion fails (e.g. file already gone), we still want to clear the DB
                console.warn('Storage deletion failed or file already missing. Continuing to clear database metadata...', storageError);
            }
        }

        // 3. Always attempt to delete metadata if we have a user
        const { error: dbError } = await supabase
            .from('user_data')
            .delete()
            .eq('user_id', user.id)
            .eq('key', key);

        if (dbError) {
            console.error(`Database metadata deletion failed for key ${key}:`, dbError);
            throw dbError;
        }

        console.log(`Successfully cleared metadata for key ${key}`);
    } catch (error) {
        console.error('Error in removeImageCompletely:', error);
        throw error;
    }
};
