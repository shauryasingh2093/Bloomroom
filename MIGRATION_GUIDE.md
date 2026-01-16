# Data Migration Guide

This guide will help you migrate your existing Bloomroom data from localStorage to Supabase.

## Prerequisites

1. **Supabase Setup Complete**: Ensure you have run both SQL setup scripts:
   - `supabase_complete_setup.sql`
   - `supabase_room_logging_fixed.sql`

2. **User Authentication**: You must be signed in to migrate your data.

3. **Backup Your Data**: Before migrating, consider backing up your localStorage data:
   ```javascript
   // In browser console
   const backup = {};
   for (let i = 0; i < localStorage.length; i++) {
       const key = localStorage.key(i);
       backup[key] = localStorage.getItem(key);
   }
   console.log(JSON.stringify(backup));
   // Copy this output and save it somewhere safe
   ```

## Migration Methods

### Method 1: Automatic Migration (Recommended)

The easiest way to migrate your data is to use the built-in migration utility:

1. **Open Browser Console** (F12 or Cmd+Option+I)

2. **Import and Run Migration**:
   ```javascript
   // Check if you have data to migrate
   import { checkForLocalStorageData } from './src/utils/dataMigration.js';
   const check = checkForLocalStorageData();
   console.log('Data to migrate:', check);

   // Run the migration
   import { migrateAllData } from './src/utils/dataMigration.js';
   const results = await migrateAllData();
   console.log('Migration results:', results);
   ```

3. **Review Results**: The migration will show you:
   - Number of items migrated for each data type
   - Any errors encountered
   - Total items migrated

### Method 2: Selective Migration

If you want to migrate specific data types:

```javascript
import { 
    migrateJournalEntries,
    migrateDailyCheckins,
    migrateIntentions,
    migrateQuickNotes
} from './src/utils/dataMigration.js';

// Migrate only journal entries
const journalResults = await migrateJournalEntries();

// Migrate only daily check-ins
const checkinResults = await migrateDailyCheckins();

// Migrate only intentions
const intentionResults = await migrateIntentions();

// Migrate only quick notes
const noteResults = await migrateQuickNotes();
```

### Method 3: Manual Migration via UI

We can add a migration button to the app:

1. Create a new component or add to settings
2. Import the migration utilities
3. Add a button that calls `migrateAllData()`
4. Show progress and results to the user

## What Gets Migrated

### Journal Entries
- **Source**: `localStorage` key `bloomroom_journal_entries`
- **Destination**: `journal_entries` table in Supabase
- **Data**: Entry text and dates
- **Note**: Base64 images will need to be re-uploaded manually

### Daily Check-ins
- **Source**: `localStorage` key `bloomroom_daily_checkins`
- **Destination**: `daily_checkins` table in Supabase
- **Data**: Mood, energy, sleep ratings, and notes

### Intentions (Bucket List)
- **Source**: `localStorage` key `bloomroom_intentions`
- **Destination**: `intentions` table in Supabase
- **Data**: Intention text

### Quick Notes
- **Source**: `localStorage` key `bloomroom_quick_notes`
- **Destination**: `quick_notes` table in Supabase
- **Data**: Note text

## After Migration

### Verify Your Data

1. Check each section of the app to ensure your data appears correctly
2. Test creating new entries to ensure sync is working
3. Try accessing from a different device to verify cloud sync

### Clean Up (Optional)

Once you've verified that all your data has been successfully migrated:

```javascript
import { clearMigratedLocalStorage } from './src/utils/dataMigration.js';
clearMigratedLocalStorage();
```

> ⚠️ **Warning**: Only clear localStorage after you've verified all data is in Supabase!

## Troubleshooting

### "Not authenticated" Error
- Make sure you're signed in before running the migration
- Try signing out and back in

### Some Items Didn't Migrate
- Check the migration results for specific errors
- You can re-run the migration - it will skip duplicates
- For persistent errors, check the browser console for details

### Images Not Showing
- Base64 images from localStorage cannot be automatically migrated
- You'll need to re-upload these images manually
- The text content of journal entries will still be migrated

### Data Appears Twice
- The migration uses `upsert` to prevent duplicates
- If you see duplicates, there may be an issue with the unique constraints
- Contact support or check the database schema

## Data Already Synced via useDataSync

The following data types are already synced to Supabase via the `useDataSync` hook and **do not need migration**:

- **Tasks** (Planning Room)
- **Goals** (Future Room)
- **Self-care activities** (Care Room)
- **Vision Board goals**

These are stored in the `user_data` table and sync automatically.

## Need Help?

If you encounter issues during migration:

1. Check the browser console for detailed error messages
2. Ensure all SQL scripts have been run in Supabase
3. Verify your Supabase connection is working
4. Check that RLS policies are correctly configured

## Migration Checklist

- [ ] Backed up localStorage data
- [ ] Verified Supabase setup is complete
- [ ] Signed in to the app
- [ ] Ran migration utility
- [ ] Verified all data appears correctly
- [ ] Tested creating new entries
- [ ] Tested cross-device sync
- [ ] (Optional) Cleared old localStorage data
