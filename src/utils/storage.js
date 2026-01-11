// Storage utilities for Bloomroom
// All data is stored locally in browser localStorage
import { getCurrentProfile } from './profileManager';

// Get profile-scoped key
const getProfileKey = (key) => {
  const profile = getCurrentProfile();
  return profile ? `${profile.id}_${key}` : key;
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

// Clear all data (for reset functionality)
export const clearAllData = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};
