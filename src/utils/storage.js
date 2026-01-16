// Storage utilities for Bloomroom
// 
// ⚠️ IMPORTANT: localStorage is for UX ONLY, never for source-of-truth data
// 
// localStorage Usage Rules:
// ✅ DO use for: Preferences, UI state, profile management, caching synced data
// ❌ DON'T use for: Critical user data, anything that can't be regenerated
// 
// Source of truth for user data is Supabase. localStorage is for:
// - Fast local caching (offline support)
// - User preferences and settings
// - Profile management (multi-user browser support)
// - Temporary state that enhances UX
//
import { getCurrentProfile } from './profileManager';

// Get profile-scoped key
const getProfileKey = (key) => {
  const profile = getCurrentProfile();
  return profile ? `${profile.id}_${key}` : key;
};


// Storage version for schema migration safety
const STORAGE_VERSION = '1.0';
const VERSION_KEY = 'bloomroom_storage_version';

// Check and handle storage version
export const checkStorageVersion = () => {
  try {
    const currentVersion = localStorage.getItem(VERSION_KEY);

    if (!currentVersion) {
      // First time setup
      localStorage.setItem(VERSION_KEY, STORAGE_VERSION);
      return { isValid: true, isFirstTime: true };
    }

    if (currentVersion !== STORAGE_VERSION) {
      console.warn(`Storage version mismatch. Expected ${STORAGE_VERSION}, found ${currentVersion}`);
      return { isValid: false, oldVersion: currentVersion, newVersion: STORAGE_VERSION };
    }

    return { isValid: true, isFirstTime: false };
  } catch (error) {
    console.error('Error checking storage version:', error);
    return { isValid: true, isFirstTime: false }; // Fail gracefully
  }
};

// Migrate or clear storage on version mismatch
export const handleStorageVersionMismatch = (clearAll = false) => {
  try {
    if (clearAll) {
      // Clear all cached data but keep profiles and preferences
      const keysToKeep = [
        STORAGE_KEYS.PREFERENCES,
        'bloomroom_profiles',
        'bloomroom_active_profile'
      ];

      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith('bloomroom_') && !keysToKeep.includes(key)) {
          localStorage.removeItem(key);
        }
      }
    }

    // Update version
    localStorage.setItem(VERSION_KEY, STORAGE_VERSION);
    console.log(`Storage migrated to version ${STORAGE_VERSION}`);
  } catch (error) {
    console.error('Error handling storage version mismatch:', error);
  }
};

const STORAGE_KEYS = {
  TASKS: 'bloomroom_tasks',
  GOALS: 'bloomroom_goals',
  MIND_DUMPS: 'bloomroom_mind_dumps',
  DOCUMENTATION: 'bloomroom_documentation',
  SELF_CARE: 'bloomroom_self_care',
  STREAK: 'bloomroom_streak',
  PREFERENCES: 'bloomroom_preferences',
  LAST_VISIT: 'bloomroom_last_visit',
  DAILY_CHECKINS: 'bloomroom_daily_checkins',
  QUICK_NOTES: 'bloomroom_quick_notes',
  JOURNAL: 'bloomroom_journal',
  INTENTIONS: 'bloomroom_intentions',
  GOAL_TARGET: 'bloomroom_goal_target',
  VISION_BOARD_IMAGE: 'bloomroom_vision_board_image',
};

// Generic save function
export const saveToStorage = (key, data) => {
  try {
    const profileKey = getProfileKey(key);
    localStorage.setItem(profileKey, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

// Generic load function
export const loadFromStorage = (key, defaultValue = null) => {
  try {
    const profileKey = getProfileKey(key);
    const item = localStorage.getItem(profileKey);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};

// Tasks
export const saveTasks = (tasks) => saveToStorage(STORAGE_KEYS.TASKS, tasks);
export const loadTasks = () => loadFromStorage(STORAGE_KEYS.TASKS, []);

// Goals
export const saveGoals = (goals) => saveToStorage(STORAGE_KEYS.GOALS, goals);
export const loadGoals = () => loadFromStorage(STORAGE_KEYS.GOALS, []);

// Goal Target
export const saveGoalTarget = (target) => saveToStorage(STORAGE_KEYS.GOAL_TARGET, target);
export const loadGoalTarget = () => loadFromStorage(STORAGE_KEYS.GOAL_TARGET, 15);

// Mind Dumps
export const saveMindDumps = (dumps) => saveToStorage(STORAGE_KEYS.MIND_DUMPS, dumps);
export const loadMindDumps = () => loadFromStorage(STORAGE_KEYS.MIND_DUMPS, []);

// Documentation
export const saveDocumentation = (docs) => saveToStorage(STORAGE_KEYS.DOCUMENTATION, docs);
export const loadDocumentation = () => loadFromStorage(STORAGE_KEYS.DOCUMENTATION, []);

// Self Care
export const saveSelfCare = (data) => saveToStorage(STORAGE_KEYS.SELF_CARE, data);
export const loadSelfCare = () => loadFromStorage(STORAGE_KEYS.SELF_CARE, {});

// Streak
export const saveStreak = (streak) => saveToStorage(STORAGE_KEYS.STREAK, streak);
export const loadStreak = () => loadFromStorage(STORAGE_KEYS.STREAK, { count: 0, lastDate: null, pausedUntil: null });

// Preferences
export const savePreferences = (prefs) => saveToStorage(STORAGE_KEYS.PREFERENCES, prefs);
export const loadPreferences = () => loadFromStorage(STORAGE_KEYS.PREFERENCES, {});

// Last Visit
export const saveLastVisit = () => saveToStorage(STORAGE_KEYS.LAST_VISIT, new Date().toISOString());
export const loadLastVisit = () => loadFromStorage(STORAGE_KEYS.LAST_VISIT, null);

// Daily Check-ins
export const saveDailyCheckins = (checkins) => saveToStorage(STORAGE_KEYS.DAILY_CHECKINS, checkins);
export const loadDailyCheckins = () => loadFromStorage(STORAGE_KEYS.DAILY_CHECKINS, {});

// Quick Notes
export const saveQuickNotes = (notes) => saveToStorage(STORAGE_KEYS.QUICK_NOTES, notes);
export const loadQuickNotes = () => loadFromStorage(STORAGE_KEYS.QUICK_NOTES, []);

// Vision Board Image
export const saveVisionBoardImage = (imageData) => saveToStorage(STORAGE_KEYS.VISION_BOARD_IMAGE, imageData);
export const loadVisionBoardImage = () => loadFromStorage(STORAGE_KEYS.VISION_BOARD_IMAGE, null);
export const removeVisionBoardImage = () => saveToStorage(STORAGE_KEYS.VISION_BOARD_IMAGE, null);

// Clear all data (for reset functionality)
export const clearAllData = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};
