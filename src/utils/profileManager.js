// Profile Management System
// Handles creation, switching, and deletion of user profiles
//
// ⚠️ localStorage Usage: Profile management is UX-only data
// Profiles enable multi-user browser support but are not source-of-truth
// User data is stored in Supabase and scoped by authentication, not profiles

const PROFILES_KEY = 'bloomroom_profiles';
const ACTIVE_PROFILE_KEY = 'bloomroom_active_profile';

// Generate unique profile ID
const generateProfileId = () => {
    return `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get all profiles
export const getProfiles = () => {
    try {
        const profiles = localStorage.getItem(PROFILES_KEY);
        return profiles ? JSON.parse(profiles) : [];
    } catch (error) {
        console.error('Error loading profiles:', error);
        return [];
    }
};

// Save profiles list
const saveProfiles = (profiles) => {
    try {
        localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
        return true;
    } catch (error) {
        console.error('Error saving profiles:', error);
        return false;
    }
};

// Create new profile
export const createProfile = (name, avatarIndex = 0) => {
    const profiles = getProfiles();
    const newProfile = {
        id: generateProfileId(),
        name: name.trim() || 'User',
        avatarIndex,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString()
    };

    profiles.push(newProfile);
    saveProfiles(profiles);
    return newProfile;
};

// Get current active profile
export const getCurrentProfile = () => {
    try {
        const activeId = localStorage.getItem(ACTIVE_PROFILE_KEY);
        if (!activeId) return null;

        const profiles = getProfiles();
        return profiles.find(p => p.id === activeId) || null;
    } catch (error) {
        console.error('Error getting current profile:', error);
        return null;
    }
};

// Set active profile
export const setActiveProfile = (profileId) => {
    try {
        const profiles = getProfiles();
        const profile = profiles.find(p => p.id === profileId);

        if (!profile) {
            console.error('Profile not found:', profileId);
            return false;
        }

        // Update last active time
        profile.lastActive = new Date().toISOString();
        saveProfiles(profiles);

        localStorage.setItem(ACTIVE_PROFILE_KEY, profileId);
        return true;
    } catch (error) {
        console.error('Error setting active profile:', error);
        return false;
    }
};

// Delete profile and all its data
export const deleteProfile = (profileId) => {
    try {
        // Remove from profiles list
        const profiles = getProfiles();
        const updatedProfiles = profiles.filter(p => p.id !== profileId);
        saveProfiles(updatedProfiles);

        // Clear active profile if it was the deleted one
        const activeId = localStorage.getItem(ACTIVE_PROFILE_KEY);
        if (activeId === profileId) {
            localStorage.removeItem(ACTIVE_PROFILE_KEY);
        }

        // Remove all data for this profile
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(`${profileId}_`)) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));

        return true;
    } catch (error) {
        console.error('Error deleting profile:', error);
        return false;
    }
};

// Update profile info
export const updateProfile = (profileId, updates) => {
    try {
        const profiles = getProfiles();
        const profileIndex = profiles.findIndex(p => p.id === profileId);

        if (profileIndex === -1) {
            console.error('Profile not found:', profileId);
            return false;
        }

        profiles[profileIndex] = {
            ...profiles[profileIndex],
            ...updates,
            id: profileId // Ensure ID cannot be changed
        };

        saveProfiles(profiles);
        return true;
    } catch (error) {
        console.error('Error updating profile:', error);
        return false;
    }
};

// Migrate existing data to default profile
export const migrateExistingData = () => {
    try {
        const profiles = getProfiles();

        // If profiles already exist, migration already happened
        if (profiles.length > 0) {
            return false;
        }

        // Create default profile
        const defaultProfile = createProfile('Default User', 0);

        // Get all existing data keys (non-profile keys)
        const dataKeys = [];
        const excludeKeys = [PROFILES_KEY, ACTIVE_PROFILE_KEY];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('bloomroom_') && !excludeKeys.includes(key)) {
                dataKeys.push(key);
            }
        }

        // Migrate each key to profile-scoped key
        dataKeys.forEach(key => {
            const value = localStorage.getItem(key);
            if (value) {
                const newKey = `${defaultProfile.id}_${key}`;
                localStorage.setItem(newKey, value);
                localStorage.removeItem(key); // Remove old key
            }
        });

        // Set as active profile
        setActiveProfile(defaultProfile.id);

        console.log('Migration complete. Created default profile with existing data.');
        return true;
    } catch (error) {
        console.error('Error during migration:', error);
        return false;
    }
};
