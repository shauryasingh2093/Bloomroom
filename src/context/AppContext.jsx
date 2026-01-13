// Global Context for Bloomroom
// Manages all application state

import { useState, useEffect } from 'react';
import { AppContext } from './appContextCore';
import {
    loadTasks, saveTasks,
    loadGoals, saveGoals,
    loadMindDumps, saveMindDumps,
    loadDocumentation, saveDocumentation,
    loadSelfCare, saveSelfCare,
    loadStreak, saveStreak,
    loadPreferences, savePreferences,
    saveLastVisit
} from '../utils/storage';
import { calculateStreak, getTodayString, getTomorrowString } from '../utils/dateHelpers';
import { getCurrentProfile } from '../utils/profileManager';
import { useDataSync } from '../hooks/useDataSync';


export const AppProvider = ({ children }) => {
    // Tasks state
    const [tasks, setTasks] = useState(() => loadTasks());

    // Goals state
    const [goals, setGoals] = useState(() => loadGoals());

    // Mind dumps state
    const [mindDumps, setMindDumps] = useState(() => loadMindDumps());

    // Documentation state
    const [documentation, setDocumentation] = useState(() => loadDocumentation());

    // Self care state
    const [selfCare, setSelfCare] = useState(() => loadSelfCare());

    // Streak state
    const [streak, setStreak] = useState(() => loadStreak());

    // Preferences state
    const [preferences, setPreferences] = useState(() => loadPreferences());

    // User Profile state
    const [userName, setUserName] = useState(() => {
        const profile = preferences.userId ? null : loadPreferences()?.userName; // Fallback for migration
        const activeProfile = getCurrentProfile();
        return activeProfile ? activeProfile.name : (profile || 'User');
    });
    const [mood, setMood] = useState(() => preferences.mood || 'calm');

    // Selected date for viewing tasks (defaults to today)
    const [selectedDate, setSelectedDate] = useState(() => getTodayString());

    // Sync Data with Supabase
    useDataSync(
        { tasks, goals, mindDumps, documentation, selfCare, streak, preferences },
        { setTasks, setGoals, setMindDumps, setDocumentation, setSelfCare, setStreak, setPreferences }
    );

    // Load visit on mount
    useEffect(() => {
        saveLastVisit();
    }, []);

    // Task functions
    const addTask = (task) => {
        const newTask = {
            id: Date.now().toString(),
            text: task,
            completed: false,
            createdAt: new Date().toISOString(),
            completedAt: null,
            date: getTodayString(),
        };
        const updatedTasks = [...tasks, newTask];
        setTasks(updatedTasks);
        saveTasks(updatedTasks);
    };

    const completeTask = (taskId) => {
        const updatedTasks = tasks.map(task =>
            task.id === taskId
                ? { ...task, completed: true, completedAt: new Date().toISOString() }
                : task
        );
        setTasks(updatedTasks);
        saveTasks(updatedTasks);

        // Update streak
        updateStreakWithActivity();
    };

    const uncompleteTask = (taskId) => {
        const updatedTasks = tasks.map(task =>
            task.id === taskId
                ? { ...task, completed: false, completedAt: null }
                : task
        );
        setTasks(updatedTasks);
        saveTasks(updatedTasks);
    };

    const postponeTask = (taskId) => {
        const updatedTasks = tasks.map(task =>
            task.id === taskId
                ? { ...task, date: getTomorrowString() }
                : task
        );
        setTasks(updatedTasks);
        saveTasks(updatedTasks);
    };

    const skipTask = (taskId) => {
        const updatedTasks = tasks.filter(t => t.id !== taskId);
        setTasks(updatedTasks);
        saveTasks(updatedTasks);
    };

    const deleteTask = (taskId) => {
        const updatedTasks = tasks.filter(t => t.id !== taskId);
        setTasks(updatedTasks);
        saveTasks(updatedTasks);
    };

    const editTask = (taskId, newText) => {
        const updatedTasks = tasks.map(task =>
            task.id === taskId ? { ...task, text: newText } : task
        );
        setTasks(updatedTasks);
        saveTasks(updatedTasks);
    };

    // Goal functions
    const addGoal = (goal) => {
        const newGoal = {
            id: Date.now().toString(),
            title: goal.title,
            description: goal.description,
            monthlyFocus: goal.monthlyFocus || '',
            weeklyIntentions: goal.weeklyIntentions || [],
            dailyActions: goal.dailyActions || [],
            createdAt: new Date().toISOString(),
            completed: false,
        };
        const updatedGoals = [...goals, newGoal];
        setGoals(updatedGoals);
        saveGoals(updatedGoals);
    };

    const updateGoal = (goalId, updates) => {
        const updatedGoals = goals.map(goal =>
            goal.id === goalId ? { ...goal, ...updates } : goal
        );
        setGoals(updatedGoals);
        saveGoals(updatedGoals);
    };

    const deleteGoal = (goalId) => {
        const updatedGoals = goals.filter(g => g.id !== goalId);
        setGoals(updatedGoals);
        saveGoals(updatedGoals);
    };

    const toggleGoal = (goalId) => {
        const updatedGoals = goals.map(goal =>
            goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
        );
        setGoals(updatedGoals);
        saveGoals(updatedGoals);
    };

    // Mind dump functions
    const addMindDump = (content, aiResponse) => {
        const newDump = {
            id: Date.now().toString(),
            content,
            aiResponse,
            createdAt: new Date().toISOString(),
        };
        const updatedDumps = [newDump, ...mindDumps];
        setMindDumps(updatedDumps);
        saveMindDumps(updatedDumps);
    };

    // Documentation functions
    const addDocumentation = (entry) => {
        const newEntry = {
            id: Date.now().toString(),
            prompt: entry.prompt,
            content: entry.content,
            createdAt: new Date().toISOString(),
        };
        const updatedDocs = [newEntry, ...documentation];
        setDocumentation(updatedDocs);
        saveDocumentation(updatedDocs);
    };

    // Self care functions
    const updateSelfCare = (date, activity, status) => {
        const updatedSelfCare = {
            ...selfCare,
            [date]: {
                ...selfCare[date],
                [activity]: status,
            },
        };
        setSelfCare(updatedSelfCare);
        saveSelfCare(updatedSelfCare);
    };

    // Streak functions
    const updateStreakWithActivity = () => {
        const hasActivityToday = tasks.some(task =>
            task.completed && task.date === getTodayString()
        );

        const newStreak = calculateStreak(streak, hasActivityToday);
        setStreak(newStreak);
        saveStreak(newStreak);
    };

    // Preferences functions
    const updatePreferences = (newPrefs) => {
        const updatedPrefs = { ...preferences, ...newPrefs };
        setPreferences(updatedPrefs);
        savePreferences(updatedPrefs);
    };

    const changeUserName = (name) => {
        setUserName(name);
        updatePreferences({ userName: name });
    };

    const changeMood = (newMood) => {
        setMood(newMood);
        updatePreferences({ mood: newMood });
    };

    // Get today's tasks
    const getTodaysTasks = () => {
        const today = getTodayString();
        return tasks.filter(task => task.date === today);
    };

    // Get tasks for a specific date
    const getTasksForDate = (dateString) => {
        return tasks.filter(task => task.date === dateString);
    };

    // Get completed tasks count for today
    const getTodaysCompletedCount = () => {
        return getTodaysTasks().filter(task => task.completed).length;
    };

    const value = {
        // State
        tasks,
        goals,
        mindDumps,
        documentation,
        selfCare,
        streak,
        preferences,
        userName,
        mood,

        // Task functions
        addTask,
        completeTask,
        uncompleteTask,
        postponeTask,
        skipTask,
        deleteTask,
        editTask,
        getTodaysTasks,
        getTodaysCompletedCount,
        getTasksForDate,

        // Selected date
        selectedDate,
        setSelectedDate,

        // Goal functions
        addGoal,
        updateGoal,
        deleteGoal,
        toggleGoal,

        // Mind dump functions
        addMindDump,

        // Documentation functions
        addDocumentation,

        // Self care functions
        updateSelfCare,

        // Streak functions
        updateStreakWithActivity,

        // Preferences functions
        updatePreferences,
        changeUserName,
        changeMood,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
