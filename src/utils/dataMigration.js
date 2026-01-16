/**
 * Data Migration Utility
 * Migrates existing localStorage data to Supabase
 */

import { supabase } from './supabase';
import {
    saveJournalEntry,
    saveDailyCheckin,
    saveIntention,
    saveQuickNote
} from './supabaseData';
import { STORAGE_KEYS } from './storage';

/**
 * Migrate journal entries from localStorage to Supabase
 */
export const migrateJournalEntries = async () => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            throw new Error('User must be authenticated to migrate data');
        }

        const journalData = localStorage.getItem(STORAGE_KEYS.JOURNAL_ENTRIES);
        if (!journalData) {
            console.log('No journal entries to migrate');
            return { success: true, count: 0 };
        }

        const entries = JSON.parse(journalData);
        let migratedCount = 0;
        const errors = [];

        for (const [date, entry] of Object.entries(entries)) {
            try {
                // Handle image data
                let imageData = null;
                if (entry.image) {
                    // If it's a base64 string, we'll need to upload it
                    if (typeof entry.image === 'string' && entry.image.startsWith('data:')) {
                        // For now, skip base64 images - user will need to re-upload
                        console.warn(`Skipping base64 image for ${date} - please re-upload`);
                    } else if (entry.image.url) {
                        // Already migrated format
                        imageData = entry.image;
                    }
                }

                await saveJournalEntry(date, entry.text, imageData);
                migratedCount++;
            } catch (error) {
                console.error(`Error migrating journal entry for ${date}:`, error);
                errors.push({ date, error: error.message });
            }
        }

        console.log(`Migrated ${migratedCount} journal entries`);
        return { success: true, count: migratedCount, errors };
    } catch (error) {
        console.error('Error migrating journal entries:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Migrate daily check-ins from localStorage to Supabase
 */
export const migrateDailyCheckins = async () => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            throw new Error('User must be authenticated to migrate data');
        }

        const checkinData = localStorage.getItem(STORAGE_KEYS.DAILY_CHECKINS);
        if (!checkinData) {
            console.log('No daily check-ins to migrate');
            return { success: true, count: 0 };
        }

        const checkins = JSON.parse(checkinData);
        let migratedCount = 0;
        const errors = [];

        for (const [date, checkin] of Object.entries(checkins)) {
            try {
                await saveDailyCheckin(
                    date,
                    checkin.mood,
                    checkin.energy,
                    checkin.sleep,
                    checkin.notes
                );
                migratedCount++;
            } catch (error) {
                console.error(`Error migrating check-in for ${date}:`, error);
                errors.push({ date, error: error.message });
            }
        }

        console.log(`Migrated ${migratedCount} daily check-ins`);
        return { success: true, count: migratedCount, errors };
    } catch (error) {
        console.error('Error migrating daily check-ins:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Migrate intentions from localStorage to Supabase
 */
export const migrateIntentions = async () => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            throw new Error('User must be authenticated to migrate data');
        }

        const intentionsData = localStorage.getItem(STORAGE_KEYS.INTENTIONS);
        if (!intentionsData) {
            console.log('No intentions to migrate');
            return { success: true, count: 0 };
        }

        const intentions = JSON.parse(intentionsData);
        let migratedCount = 0;
        const errors = [];

        for (const intention of intentions) {
            try {
                await saveIntention(intention.text || intention);
                migratedCount++;
            } catch (error) {
                console.error('Error migrating intention:', error);
                errors.push({ intention, error: error.message });
            }
        }

        console.log(`Migrated ${migratedCount} intentions`);
        return { success: true, count: migratedCount, errors };
    } catch (error) {
        console.error('Error migrating intentions:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Migrate quick notes from localStorage to Supabase
 */
export const migrateQuickNotes = async () => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            throw new Error('User must be authenticated to migrate data');
        }

        const notesData = localStorage.getItem(STORAGE_KEYS.QUICK_NOTES);
        if (!notesData) {
            console.log('No quick notes to migrate');
            return { success: true, count: 0 };
        }

        const notes = JSON.parse(notesData);
        let migratedCount = 0;
        const errors = [];

        for (const note of notes) {
            try {
                await saveQuickNote(note.text || note);
                migratedCount++;
            } catch (error) {
                console.error('Error migrating quick note:', error);
                errors.push({ note, error: error.message });
            }
        }

        console.log(`Migrated ${migratedCount} quick notes`);
        return { success: true, count: migratedCount, errors };
    } catch (error) {
        console.error('Error migrating quick notes:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Migrate all data from localStorage to Supabase
 */
export const migrateAllData = async () => {
    console.log('Starting data migration...');

    const results = {
        journalEntries: await migrateJournalEntries(),
        dailyCheckins: await migrateDailyCheckins(),
        intentions: await migrateIntentions(),
        quickNotes: await migrateQuickNotes(),
    };

    const totalMigrated =
        (results.journalEntries.count || 0) +
        (results.dailyCheckins.count || 0) +
        (results.intentions.count || 0) +
        (results.quickNotes.count || 0);

    console.log(`Migration complete! Migrated ${totalMigrated} total items.`);
    console.log('Results:', results);

    return results;
};

/**
 * Check if there's any localStorage data that needs migration
 */
export const checkForLocalStorageData = () => {
    const hasJournalEntries = !!localStorage.getItem(STORAGE_KEYS.JOURNAL_ENTRIES);
    const hasDailyCheckins = !!localStorage.getItem(STORAGE_KEYS.DAILY_CHECKINS);
    const hasIntentions = !!localStorage.getItem(STORAGE_KEYS.INTENTIONS);
    const hasQuickNotes = !!localStorage.getItem(STORAGE_KEYS.QUICK_NOTES);

    return {
        hasData: hasJournalEntries || hasDailyCheckins || hasIntentions || hasQuickNotes,
        details: {
            journalEntries: hasJournalEntries,
            dailyCheckins: hasDailyCheckins,
            intentions: hasIntentions,
            quickNotes: hasQuickNotes,
        }
    };
};

/**
 * Clear migrated localStorage data (use with caution!)
 */
export const clearMigratedLocalStorage = () => {
    const keysToRemove = [
        STORAGE_KEYS.JOURNAL_ENTRIES,
        STORAGE_KEYS.DAILY_CHECKINS,
        STORAGE_KEYS.INTENTIONS,
        STORAGE_KEYS.QUICK_NOTES,
    ];

    keysToRemove.forEach(key => {
        localStorage.removeItem(key);
    });

    console.log('Cleared migrated localStorage data');
};
