// Date helper utilities for Bloomroom
import { format, isToday, isYesterday, differenceInDays, startOfDay } from 'date-fns';

// Get time-based greeting
export const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
        return 'Good morning';
    } else if (hour < 17) {
        return 'Good afternoon';
    } else if (hour < 21) {
        return 'Good evening';
    } else {
        return 'Good night';
    }
};

// Get a gentle greeting message
export const getGentleGreeting = () => {
    const greetings = [
        'Welcome back',
        'Hello again',
        'Good to see you',
        'You\'re here',
    ];

    const timeGreeting = getGreeting();
    const gentleGreeting = greetings[Math.floor(Math.random() * greetings.length)];

    return `${timeGreeting}. ${gentleGreeting}.`;
};

// Format date for display
export const formatDate = (date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isToday(dateObj)) {
        return 'Today';
    } else if (isYesterday(dateObj)) {
        return 'Yesterday';
    } else {
        return format(dateObj, 'MMM d, yyyy');
    }
};

// Format time for display
export const formatTime = (date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'h:mm a');
};

// Calculate streak with pause logic
export const calculateStreak = (streakData, hasActivityToday) => {
    const today = startOfDay(new Date());
    const lastDate = streakData.lastDate ? startOfDay(new Date(streakData.lastDate)) : null;

    // If no previous activity
    if (!lastDate) {
        return {
            count: hasActivityToday ? 1 : 0,
            lastDate: hasActivityToday ? today.toISOString() : null,
            pausedUntil: null,
            status: 'new'
        };
    }

    const daysSinceLastActivity = differenceInDays(today, lastDate);

    // Same day - no change
    if (daysSinceLastActivity === 0) {
        return {
            ...streakData,
            status: 'active'
        };
    }

    // Next day - continue streak
    if (daysSinceLastActivity === 1 && hasActivityToday) {
        return {
            count: streakData.count + 1,
            lastDate: today.toISOString(),
            pausedUntil: null,
            status: 'growing'
        };
    }

    // 2-3 days gap - pause instead of break
    if (daysSinceLastActivity >= 2 && daysSinceLastActivity <= 3) {
        if (hasActivityToday) {
            return {
                count: streakData.count, // Keep the count
                lastDate: today.toISOString(),
                pausedUntil: null,
                status: 'resumed'
            };
        } else {
            return {
                ...streakData,
                pausedUntil: today.toISOString(),
                status: 'paused'
            };
        }
    }

    // More than 3 days - gentle reset
    if (daysSinceLastActivity > 3) {
        return {
            count: hasActivityToday ? 1 : 0,
            lastDate: hasActivityToday ? today.toISOString() : null,
            pausedUntil: null,
            status: 'reset'
        };
    }

    return streakData;
};

// Get streak message based on status
export const getStreakMessage = (status, count) => {
    switch (status) {
        case 'new':
            return 'Starting fresh 🌱';
        case 'active':
            return 'You showed up today ✨';
        case 'growing':
            return `${count} days of showing up 🌸`;
        case 'resumed':
            return 'Welcome back. You\'re still growing 🌿';
        case 'paused':
            return 'Taking a pause is okay 💚';
        case 'reset':
            return 'Every day is a new beginning 🌅';
        default:
            return 'One step at a time 🌸';
    }
};

// Check if date is today
export const isDateToday = (date) => {
    return isToday(typeof date === 'string' ? new Date(date) : date);
};

// Get today's date string
export const getTodayString = () => {
    return startOfDay(new Date()).toISOString();
};

// Get tomorrow's date string
export const getTomorrowString = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return startOfDay(tomorrow).toISOString();
};

// Get current date-time string
export const getNowString = () => {
    return new Date().toISOString();
};

