// Comprehensive Supabase Data Utilities for Bloomroom
// Handles all data operations with Supabase database

import { supabase } from '../lib/supabase';

// ==================== JOURNAL ENTRIES ====================

/**
 * Save or update a journal entry
 */
export const saveJournalEntry = async (date, text, image) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) throw new Error('Not authenticated');

        const entry = {
            user_id: user.id,
            entry_date: typeof date === 'string' ? date : new Date(date).toISOString().split('T')[0],
            text: text || null,
            image_url: image?.url || null,
            image_path: image?.path || null,
            updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase
            .from('journal_entries')
            .upsert(entry, { onConflict: 'user_id,entry_date' })
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error saving journal entry:', error);
        throw error;
    }
};

/**
 * Load all journal entries for current user
 */
export const loadJournalEntries = async () => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) return [];

        const { data, error } = await supabase
            .from('journal_entries')
            .select('*')
            .eq('user_id', user.id)
            .order('entry_date', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error loading journal entries:', error);
        return [];
    }
};

/**
 * Delete a journal entry
 */
export const deleteJournalEntry = async (id) => {
    try {
        const { error } = await supabase
            .from('journal_entries')
            .delete()
            .eq('id', id);

        if (error) throw error;
    } catch (error) {
        console.error('Error deleting journal entry:', error);
        throw error;
    }
};

// ==================== DAILY CHECK-INS ====================

/**
 * Save a daily check-in
 */
export const saveDailyCheckin = async (date, question, answer) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('daily_checkins')
            .upsert({
                user_id: user.id,
                checkin_date: typeof date === 'string' ? date : new Date(date).toISOString().split('T')[0],
                question,
                answer
            }, { onConflict: 'user_id,checkin_date' })
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error saving daily check-in:', error);
        throw error;
    }
};

/**
 * Load daily check-ins for current user
 */
export const loadDailyCheckinsFromDB = async (limit = 14) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) return {};

        const { data, error } = await supabase
            .from('daily_checkins')
            .select('*')
            .eq('user_id', user.id)
            .order('checkin_date', { ascending: false })
            .limit(limit);

        if (error) throw error;

        // Convert to object format { 'YYYY-MM-DD': { question, answer, timestamp } }
        return (data || []).reduce((acc, item) => {
            acc[item.checkin_date] = {
                question: item.question,
                answer: item.answer,
                timestamp: item.created_at
            };
            return acc;
        }, {});
    } catch (error) {
        console.error('Error loading daily check-ins:', error);
        return {};
    }
};

// ==================== INTENTIONS ====================

/**
 * Save a new intention
 */
export const saveIntention = async (text) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('intentions')
            .insert({ user_id: user.id, text })
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error saving intention:', error);
        throw error;
    }
};

/**
 * Load all intentions for current user
 */
export const loadIntentionsFromDB = async () => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) return [];

        const { data, error } = await supabase
            .from('intentions')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error loading intentions:', error);
        return [];
    }
};

/**
 * Update an intention
 */
export const updateIntention = async (id, updates) => {
    try {
        const { data, error } = await supabase
            .from('intentions')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating intention:', error);
        throw error;
    }
};

/**
 * Delete an intention
 */
export const deleteIntention = async (id) => {
    try {
        const { error } = await supabase
            .from('intentions')
            .delete()
            .eq('id', id);

        if (error) throw error;
    } catch (error) {
        console.error('Error deleting intention:', error);
        throw error;
    }
};

// ==================== QUICK NOTES ====================

/**
 * Save a new quick note
 */
export const saveQuickNote = async (text) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('quick_notes')
            .insert({ user_id: user.id, text })
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error saving quick note:', error);
        throw error;
    }
};

/**
 * Load all quick notes for current user
 */
export const loadQuickNotesFromDB = async () => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) return [];

        const { data, error } = await supabase
            .from('quick_notes')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error loading quick notes:', error);
        return [];
    }
};

/**
 * Update a quick note
 */
export const updateQuickNote = async (id, text) => {
    try {
        const { data, error } = await supabase
            .from('quick_notes')
            .update({ text, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating quick note:', error);
        throw error;
    }
};

/**
 * Delete a quick note
 */
export const deleteQuickNote = async (id) => {
    try {
        const { error } = await supabase
            .from('quick_notes')
            .delete()
            .eq('id', id);

        if (error) throw error;
    } catch (error) {
        console.error('Error deleting quick note:', error);
        throw error;
    }
};

// ==================== USER SETTINGS ====================

/**
 * Load user settings
 */
export const loadUserSettings = async () => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) return null;

        const { data, error } = await supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows found
        return data || { goal_target: 15, preferences: {}, streak_count: 0 };
    } catch (error) {
        console.error('Error loading user settings:', error);
        return { goal_target: 15, preferences: {}, streak_count: 0 };
    }
};

/**
 * Save user settings
 */
export const saveUserSettings = async (settings) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('user_settings')
            .upsert({
                user_id: user.id,
                ...settings,
                updated_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error saving user settings:', error);
        throw error;
    }
};
