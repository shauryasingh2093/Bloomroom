import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    migrateAllData,
    checkForLocalStorageData,
    clearMigratedLocalStorage
} from '../utils/dataMigration';
import { useAuth } from '../context/AuthContext';

const DataMigrationPanel = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [migrating, setMigrating] = useState(false);
    const [results, setResults] = useState(null);
    const [hasData, setHasData] = useState(null);

    const checkData = () => {
        const check = checkForLocalStorageData();
        setHasData(check);
        return check;
    };

    const handleMigrate = async () => {
        if (!user) {
            alert('Please sign in to migrate your data');
            return;
        }

        if (!window.confirm('This will migrate your localStorage data to Supabase. Continue?')) {
            return;
        }

        setMigrating(true);
        try {
            const migrationResults = await migrateAllData();
            setResults(migrationResults);
        } catch (error) {
            console.error('Migration error:', error);
            alert('Migration failed. Check console for details.');
        } finally {
            setMigrating(false);
        }
    };

    const handleClearLocalStorage = () => {
        if (!window.confirm('⚠️ WARNING: This will permanently delete your localStorage data. Only do this after verifying your data is in Supabase. Continue?')) {
            return;
        }

        clearMigratedLocalStorage();
        alert('localStorage data cleared');
        setHasData(null);
        setResults(null);
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {!isOpen ? (
                <button
                    onClick={() => {
                        setIsOpen(true);
                        checkData();
                    }}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all text-sm font-medium"
                >
                    📦 Migrate Data
                </button>
            ) : (
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="bg-white rounded-2xl shadow-2xl p-6 w-96 max-h-[80vh] overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-slate-800">
                                Data Migration
                            </h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                ✕
                            </button>
                        </div>

                        {!user && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                                <p className="text-sm text-yellow-800">
                                    ⚠️ Please sign in to migrate your data
                                </p>
                            </div>
                        )}

                        {hasData && (
                            <div className="mb-4">
                                <h4 className="text-sm font-medium text-slate-700 mb-2">
                                    Data Found:
                                </h4>
                                <ul className="text-xs text-slate-600 space-y-1">
                                    {hasData.details.journalEntries && (
                                        <li>✓ Journal Entries</li>
                                    )}
                                    {hasData.details.dailyCheckins && (
                                        <li>✓ Daily Check-ins</li>
                                    )}
                                    {hasData.details.intentions && (
                                        <li>✓ Intentions</li>
                                    )}
                                    {hasData.details.quickNotes && (
                                        <li>✓ Quick Notes</li>
                                    )}
                                </ul>
                            </div>
                        )}

                        {hasData && !hasData.hasData && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                                <p className="text-sm text-green-800">
                                    ✓ No localStorage data found to migrate
                                </p>
                            </div>
                        )}

                        <div className="space-y-3">
                            <button
                                onClick={handleMigrate}
                                disabled={migrating || !user || (hasData && !hasData.hasData)}
                                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                            >
                                {migrating ? 'Migrating...' : 'Start Migration'}
                            </button>

                            <button
                                onClick={checkData}
                                className="w-full bg-slate-100 text-slate-700 py-2 rounded-lg text-sm hover:bg-slate-200 transition-all"
                            >
                                Check for Data
                            </button>
                        </div>

                        {results && (
                            <div className="mt-4 bg-slate-50 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-slate-700 mb-2">
                                    Migration Results:
                                </h4>
                                <div className="text-xs text-slate-600 space-y-1">
                                    <p>Journal Entries: {results.journalEntries.count || 0}</p>
                                    <p>Daily Check-ins: {results.dailyCheckins.count || 0}</p>
                                    <p>Intentions: {results.intentions.count || 0}</p>
                                    <p>Quick Notes: {results.quickNotes.count || 0}</p>
                                </div>

                                {results.journalEntries.errors?.length > 0 && (
                                    <div className="mt-2 text-xs text-red-600">
                                        <p>Errors: {results.journalEntries.errors.length}</p>
                                    </div>
                                )}

                                <button
                                    onClick={handleClearLocalStorage}
                                    className="mt-3 w-full bg-red-50 text-red-600 py-2 rounded-lg text-sm hover:bg-red-100 transition-all"
                                >
                                    Clear localStorage
                                </button>
                            </div>
                        )}

                        <div className="mt-4 text-xs text-slate-500">
                            <p>
                                💡 See <code>MIGRATION_GUIDE.md</code> for detailed instructions
                            </p>
                        </div>
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
};

export default DataMigrationPanel;
