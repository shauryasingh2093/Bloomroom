// Global Context for Bloomroom
// Manages all application state

import { createContext, useContext, useState, useEffect } from 'react';
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
import { calculateStreak, getTodayString } from '../utils/dateHelpers';

export const AppContext = createContext();

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
};

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
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            // Remove from today
            const updatedTasks = tasks.filter(t => t.id !== taskId);
            setTasks(updatedTasks);
            saveTasks(updatedTasks);

            // Could add to tomorrow's tasks here if we implement future task scheduling
        }
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

    // Get today's tasks
    const getTodaysTasks = () => {
        const today = getTodayString();
        return tasks.filter(task => task.date === today);
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

        // Goal functions
        addGoal,
        updateGoal,
        deleteGoal,

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
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
