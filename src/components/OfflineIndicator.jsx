import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

/**
 * OfflineIndicator Component
 * 
 * Displays a subtle notification when the app is offline or when changes
 * are pending sync to Supabase. Builds user trust by surfacing sync status.
 */
const OfflineIndicator = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [syncStatus, setSyncStatus] = useState('synced'); // 'synced', 'syncing', 'offline'
    const [pendingChanges, setPendingChanges] = useState(0);

    // Monitor online/offline status
    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            setSyncStatus('syncing');
        };

        const handleOffline = () => {
            setIsOnline(false);
            setSyncStatus('offline');
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Monitor Supabase connection status
    useEffect(() => {
        if (!isOnline) {
            setSyncStatus('offline');
            return;
        }

        // Check Supabase connectivity
        const checkConnection = async () => {
            try {
                const { data: { user }, error } = await supabase.auth.getUser();
                if (error) throw error;

                if (user) {
                    setSyncStatus('synced');
                } else {
                    setSyncStatus('offline');
                }
            } catch (error) {
                console.error('Connection check failed:', error);
                setSyncStatus('offline');
            }
        };

        checkConnection();
        const interval = setInterval(checkConnection, 30000); // Check every 30s

        return () => clearInterval(interval);
    }, [isOnline]);

    // Don't show anything if everything is synced
    if (syncStatus === 'synced' && isOnline) {
        return null;
    }

    const getStatusConfig = () => {
        switch (syncStatus) {
            case 'offline':
                return {
                    icon: '📡',
                    text: 'Offline mode — changes will sync when online',
                    bgColor: 'bg-amber-500/90',
                    textColor: 'text-white'
                };
            case 'syncing':
                return {
                    icon: '🔄',
                    text: 'Syncing changes...',
                    bgColor: 'bg-blue-500/90',
                    textColor: 'text-white'
                };
            default:
                return null;
        }
    };

    const config = getStatusConfig();
    if (!config) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
            >
                <div className={`${config.bgColor} ${config.textColor} px-6 py-3 rounded-full shadow-lg backdrop-blur-sm flex items-center gap-3`}>
                    <span className="text-lg">{config.icon}</span>
                    <span className="text-sm font-medium tracking-wide">
                        {config.text}
                    </span>
                    {pendingChanges > 0 && (
                        <span className="ml-2 px-2 py-1 bg-white/20 rounded-full text-xs">
                            {pendingChanges} pending
                        </span>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default OfflineIndicator;
