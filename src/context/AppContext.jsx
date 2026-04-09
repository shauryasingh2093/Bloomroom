// Global Context for Bloomroom
// Manages all application state

import { useState, useEffect } from 'react';
import { AppContext } from './appContextCore';
import {
    loadTasks, saveTasks,
    loadGoals, saveGoals,
    loadGoalTarget, saveGoalTarget,
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
    const [goalTarget, setGoalTargetState] = useState(() => loadGoalTarget());

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
    const addTask = (taskText, date = getTodayString(), recurring = 'none') => {
        const newTask = {
            id: Date.now().toString(),
            text: taskText,
            completed: false,
            createdAt: new Date().toISOString(),
            completedAt: null,
            date: date,
            recurring: recurring,
            completedDates: [],
            excludedDates: [],
        };
        const updatedTasks = [...tasks, newTask];
        setTasks(updatedTasks);
        saveTasks(updatedTasks);
    };

    const completeTask = (taskId, dateString = getTodayString()) => {
        const updatedTasks = tasks.map(task => {
            if (task.id === taskId) {
                if (task.recurring && task.recurring !== 'none') {
                    const completedDates = [...(task.completedDates || [])];
                    if (!completedDates.includes(dateString)) {
                        completedDates.push(dateString);
                    }
                    return { ...task, completedDates };
                }
                return { ...task, completed: true, completedAt: new Date().toISOString() };
            }
            return task;
        });
        setTasks(updatedTasks);
        saveTasks(updatedTasks);

        // Update streak
        updateStreakWithActivity();
    };

    const uncompleteTask = (taskId, dateString = getTodayString()) => {
        const updatedTasks = tasks.map(task => {
            if (task.id === taskId) {
                if (task.recurring && task.recurring !== 'none') {
                    const completedDates = (task.completedDates || []).filter(d => d !== dateString);
                    return { ...task, completedDates };
                }
                return { ...task, completed: false, completedAt: null };
            }
            return task;
        });
        setTasks(updatedTasks);
        saveTasks(updatedTasks);
    };

    const postponeTask = (taskId, dateString = getTodayString()) => {
        const taskToPostpone = tasks.find(t => t.id === taskId);
        if (taskToPostpone && taskToPostpone.recurring && taskToPostpone.recurring !== 'none') {
            // For recurring tasks, postpone means skip for today (it will still be there tomorrow)
            deleteTask(taskId, dateString);
        } else {
            const updatedTasks = tasks.map(task =>
                task.id === taskId
                    ? { ...task, date: getTomorrowString() }
                    : task
            );
            setTasks(updatedTasks);
            saveTasks(updatedTasks);
        }
    };

    const skipTask = (taskId, dateString = getTodayString()) => {
        deleteTask(taskId, dateString);
    };

    const deleteTask = (taskId, dateString = getTodayString()) => {
        const taskToDelete = tasks.find(t => t.id === taskId);
        if (taskToDelete && taskToDelete.recurring && taskToDelete.recurring !== 'none') {
            // For recurring tasks, deleting from a specific day means excluding it
            const updatedTasks = tasks.map(task => {
                if (task.id === taskId) {
                    const excludedDates = [...(task.excludedDates || [])];
                    if (!excludedDates.includes(dateString)) {
                        excludedDates.push(dateString);
                    }
                    return { ...task, excludedDates };
                }
                return task;
            });
            setTasks(updatedTasks);
            saveTasks(updatedTasks);
        } else {
            const updatedTasks = tasks.filter(t => t.id !== taskId);
            setTasks(updatedTasks);
            saveTasks(updatedTasks);
        }
    };

    const deleteTaskSeries = (taskId) => {
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

    const setGoalTarget = (target) => {
        setGoalTargetState(target);
        saveGoalTarget(target);
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
        return getTasksForDate(getTodayString());
    };

    // Get tasks for a specific date
    const getTasksForDate = (dateString = getTodayString()) => {
        return tasks.filter(task => {
            // Handle non-recurring
            if (!task.recurring || task.recurring === 'none') {
                return task.date === dateString;
            }

            // Handle daily recurring
            if (task.recurring === 'daily') {
                // Task must have started on or before this date
                const isStarted = task.date <= dateString;
                // Task must not be excluded for this date
                const isNotExcluded = !(task.excludedDates || []).includes(dateString);
                return isStarted && isNotExcluded;
            }

            return false;
        });
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
        deleteTaskSeries,
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
        goalTarget,
        setGoalTarget,

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
