/**
 * useDataSync Hook
 * 
 * Syncs user data between Supabase (source of truth) and localStorage (cache)
 * 
 * ⚠️ localStorage Usage: Caching only, NOT source-of-truth
 * - localStorage provides offline access and instant load
 * - Supabase is the authoritative data source
 * - Changes sync to Supabase with debouncing
 */

import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

// Map specific keys to database keys if needed, or use generic approach
const SYNC_KEYS = [
    'tasks',
    'goals',
    'mind_dumps',
    'documentation',
    'self_care',
    'streak',
    'preferences'
];

export const useDataSync = (state, setters) => {
    const { user } = useAuth();
    const isLoadedRef = useRef(false);
    const saveTimeoutRef = useRef({});

    // Load data from Supabase DB on login
    useEffect(() => {
        if (!user) {
            isLoadedRef.current = false;
            return;
        }

        // Prevent re-fetching if already loaded for this session
        if (isLoadedRef.current) return;

        const loadData = async () => {
            try {
                const { data, error } = await supabase
                    .from('user_data')
                    .select('key, value');

                if (error) throw error;

                if (data && data.length > 0) {
                    // Update local state with cloud data
                    data.forEach(({ key, value }) => {
                        // Find corresponding setter
                        // Mapping snake_case DB keys to camelCase setters if needed
                        const keyToSetter = {
                            'tasks': 'setTasks',
                            'goals': 'setGoals',
                            'mind_dumps': 'setMindDumps',
                            'documentation': 'setDocumentation',
                            'self_care': 'setSelfCare',
                            'streak': 'setStreak',
                            'preferences': 'setPreferences'
                        };

                        const setterName = keyToSetter[key];
                        if (setters[setterName]) {
                            setters[setterName](value);
                            // We won't trigger save here because setters usually trigger save to localStorage only
                            // but we need to ensure we don't trigger the "cloud save" effect immediately
                            // The useEffect dependencies for saving will fire, but we can check equality?
                        }
                    });
                }
                isLoadedRef.current = true;
                console.log('Data synced from cloud');
            } catch (error) {
                console.error('Error loading data from Supabase:', error);
            }
        };

        loadData();
    }, [user, setters]);

    // Save data to Supabase DB on change
    useEffect(() => {
        if (!user || !isLoadedRef.current) return;

        SYNC_KEYS.forEach(key => {
            const stateKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase()); // snake to camel
            const stateValue = state[stateKey];

            // basic debounce
            if (saveTimeoutRef.current[key]) {
                clearTimeout(saveTimeoutRef.current[key]);
            }

            saveTimeoutRef.current[key] = setTimeout(async () => {
                try {
                    const { error } = await supabase
                        .from('user_data')
                        .upsert({
                            user_id: user.id,
                            key,
                            value: stateValue,
                            updated_at: new Date().toISOString()
                        });

                    if (error) throw error;
                    // console.log(`Synced ${key} to cloud`);
                } catch (error) {
                    console.error(`Error syncing ${key} to cloud:`, error);
                }
            }, 2000); // 2 second debounce
        });

        return () => {
            // Clean up timeouts
            Object.values(saveTimeoutRef.current).forEach(t => clearTimeout(t));
        };
    }, [user, ...Object.values(state)]); // Re-run when any state changes
};
