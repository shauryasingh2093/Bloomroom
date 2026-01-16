// Room Activity Logging Utilities for Bloomroom
// Track user visits and activities in each room

import { supabase } from '../lib/supabase';

// ==================== ROOM VISITS ====================

let currentVisitId = null;
let visitStartTime = null;

/**
 * Start tracking a room visit
 * @param {string} roomName - 'planning', 'future', 'care', 'memory', or 'calm'
 */
export const startRoomVisit = async (roomName) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) return null;

        visitStartTime = new Date();

        const { data, error } = await supabase
            .from('room_visits')
            .insert({
                user_id: user.id,
                room_name: roomName,
                visit_start: visitStartTime.toISOString()
            })
            .select()
            .single();

        if (error) throw error;

        currentVisitId = data.id;
        return data.id;
    } catch (error) {
        console.error('Error starting room visit:', error);
        return null;
    }
};

/**
 * End tracking a room visit
 * @param {string} visitId - Optional visit ID, uses current if not provided
 * @param {Array} activities - Optional array of activities performed
 */
export const endRoomVisit = async (visitId = null, activities = []) => {
    try {
        const id = visitId || currentVisitId;
        if (!id) return;

        const visitEnd = new Date();
        const durationSeconds = visitStartTime
            ? Math.floor((visitEnd - visitStartTime) / 1000)
            : null;

        const { error } = await supabase
            .from('room_visits')
            .update({
                visit_end: visitEnd.toISOString(),
                duration_seconds: durationSeconds,
                activities: activities
            })
            .eq('id', id);

        if (error) throw error;

        // Reset current visit
        currentVisitId = null;
        visitStartTime = null;
    } catch (error) {
        console.error('Error ending room visit:', error);
    }
};

/**
 * Log an activity during a room visit
 * @param {string} activityType - Type of activity (e.g., 'task_completed', 'goal_added')
 * @param {object} metadata - Additional data about the activity
 */
export const logRoomActivity = async (activityType, metadata = {}) => {
    try {
        if (!currentVisitId) return;

        // Get current activities
        const { data: visit } = await supabase
            .from('room_visits')
            .select('activities')
            .eq('id', currentVisitId)
            .single();

        const activities = visit?.activities || [];
        activities.push({
            type: activityType,
            timestamp: new Date().toISOString(),
            ...metadata
        });

        // Update activities
        await supabase
            .from('room_visits')
            .update({ activities })
            .eq('id', currentVisitId);
    } catch (error) {
        console.error('Error logging room activity:', error);
    }
};

/**
 * Get room visit statistics for current user
 * @param {string} roomName - Optional filter by room
 * @param {number} days - Number of days to look back (default: 30)
 */
export const getRoomStatistics = async (roomName = null, days = 30) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) return null;

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        let query = supabase
            .from('room_visits')
            .select('*')
            .eq('user_id', user.id)
            .gte('visit_start', startDate.toISOString())
            .not('duration_seconds', 'is', null);

        if (roomName) {
            query = query.eq('room_name', roomName);
        }

        const { data, error } = await query.order('visit_start', { ascending: false });

        if (error) throw error;

        // Calculate statistics
        const stats = {
            totalVisits: data.length,
            totalTimeSeconds: data.reduce((sum, v) => sum + (v.duration_seconds || 0), 0),
            averageTimeSeconds: data.length > 0
                ? Math.floor(data.reduce((sum, v) => sum + (v.duration_seconds || 0), 0) / data.length)
                : 0,
            byRoom: {}
        };

        // Group by room
        data.forEach(visit => {
            if (!stats.byRoom[visit.room_name]) {
                stats.byRoom[visit.room_name] = {
                    visits: 0,
                    totalSeconds: 0,
                    lastVisit: null
                };
            }
            stats.byRoom[visit.room_name].visits++;
            stats.byRoom[visit.room_name].totalSeconds += visit.duration_seconds || 0;
            if (!stats.byRoom[visit.room_name].lastVisit || visit.visit_start > stats.byRoom[visit.room_name].lastVisit) {
                stats.byRoom[visit.room_name].lastVisit = visit.visit_start;
            }
        });

        return stats;
    } catch (error) {
        console.error('Error getting room statistics:', error);
        return null;
    }
};

// ==================== DAILY ACTIVITY ====================

/**
 * Get daily activity summary
 * @param {Date} date - Date to get activity for (default: today)
 */
export const getDailyActivity = async (date = new Date()) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) return null;

        const dateStr = date.toISOString().split('T')[0];

        const { data, error } = await supabase
            .from('daily_activity')
            .select('*')
            .eq('user_id', user.id)
            .eq('activity_date', dateStr)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data || {
            total_time_seconds: 0,
            rooms_visited: [],
            tasks_completed: 0,
            goals_added: 0,
            journal_entries: 0,
            checkins_completed: 0
        };
    } catch (error) {
        console.error('Error getting daily activity:', error);
        return null;
    }
};

/**
 * Update daily activity counters
 * @param {string} activityType - Type of activity to increment
 * @param {number} count - Amount to increment by (default: 1)
 */
export const updateDailyActivityCounter = async (activityType, count = 1) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) return;

        const today = new Date().toISOString().split('T')[0];

        // Map activity types to column names
        const columnMap = {
            'task_completed': 'tasks_completed',
            'goal_added': 'goals_added',
            'journal_entry': 'journal_entries',
            'checkin_completed': 'checkins_completed'
        };

        const column = columnMap[activityType];
        if (!column) return;

        // Get current value
        const { data: current } = await supabase
            .from('daily_activity')
            .select(column)
            .eq('user_id', user.id)
            .eq('activity_date', today)
            .single();

        const currentValue = current?.[column] || 0;

        // Upsert with incremented value
        await supabase
            .from('daily_activity')
            .upsert({
                user_id: user.id,
                activity_date: today,
                [column]: currentValue + count,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id,activity_date' });
    } catch (error) {
        console.error('Error updating daily activity counter:', error);
    }
};

/**
 * Get activity history for a date range
 * @param {number} days - Number of days to look back
 */
export const getActivityHistory = async (days = 7) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) return [];

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const startDateStr = startDate.toISOString().split('T')[0];

        const { data, error } = await supabase
            .from('daily_activity')
            .select('*')
            .eq('user_id', user.id)
            .gte('activity_date', startDateStr)
            .order('activity_date', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error getting activity history:', error);
        return [];
    }
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Format seconds to human-readable time
 */
export const formatDuration = (seconds) => {
    if (!seconds) return '0m';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
};

/**
 * Get most visited room
 */
export const getMostVisitedRoom = async (days = 30) => {
    const stats = await getRoomStatistics(null, days);
    if (!stats || !stats.byRoom) return null;

    let mostVisited = null;
    let maxVisits = 0;

    Object.entries(stats.byRoom).forEach(([room, data]) => {
        if (data.visits > maxVisits) {
            maxVisits = data.visits;
            mostVisited = room;
        }
    });

    return mostVisited;
};
