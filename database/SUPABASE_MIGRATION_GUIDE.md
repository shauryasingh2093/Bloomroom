# Supabase Migration - Setup Instructions

## ✅ What's Been Created

### 1. Database Setup
- **File**: `supabase_complete_setup.sql`
- **Contains**: All table definitions, RLS policies, and indexes for:
  - `journal_entries` - Memory Corner journal entries with images
  - `daily_checkins` - Care Room daily reflections
  - `intentions` - Future Room intentions
  - `quick_notes` - Planning Room quick notes
  - `user_settings` - Goal targets, preferences, streak data

### 2. Data Utilities
- **File**: `src/utils/supabaseData.js`
- **Functions**: Complete CRUD operations for all data types
  - Journal: `saveJournalEntry()`, `loadJournalEntries()`, `deleteJournalEntry()`
  - Check-ins: `saveDailyCheckin()`, `loadDailyCheckinsFromDB()`
  - Intentions: `saveIntention()`, `loadIntentionsFromDB()`, `updateIntention()`, `deleteIntention()`
  - Quick Notes: `saveQuickNote()`, `loadQuickNotesFromDB()`, `updateQuickNote()`, `deleteQuickNote()`
  - Settings: `loadUserSettings()`, `saveUserSettings()`

### 3. Storage Utilities (Already Done)
- **File**: `src/utils/supabaseStorage.js`
- **Functions**: Image upload/download for Vision Board and Journal images

---

## 🚀 Implementation Steps

### Step 1: Run SQL Setup (REQUIRED)

1. Open Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Go to **SQL Editor**
4. Open `supabase_complete_setup.sql`
5. Copy and paste the entire SQL
6. Click **Run**
7. Verify tables were created (check output)

### Step 2: Update Components

The following components need to be updated to use Supabase instead of localStorage:

#### A. MemoryCorner.jsx
**Current**: Uses `loadFromStorage(JOURNAL_KEY)` and `saveToStorage()`  
**Update to**: Use `loadJournalEntries()` and `saveJournalEntry()` from `supabaseData.js`

**Key Changes**:
```javascript
// Add imports
import { loadJournalEntries, saveJournalEntry } from '../utils/supabaseData';

// Load entries on mount
useEffect(() => {
  const loadEntries = async () => {
    if (!user) return;
    const entries = await loadJournalEntries();
    // Convert to format expected by component
    setEntries(entries);
  };
  loadEntries();
}, [user]);

// Save entry
const handleSave = async () => {
  await saveJournalEntry(selectedDate, currentEntry, currentImage);
  // Reload entries
  const entries = await loadJournalEntries();
  setEntries(entries);
};
```

#### B. CareRoom.jsx
**Current**: Uses `loadDailyCheckins()` and `saveDailyCheckins()` from localStorage  
**Update to**: Use `loadDailyCheckinsFromDB()` and `saveDailyCheckin()` from `supabaseData.js`

**Key Changes**:
```javascript
// Add imports
import { loadDailyCheckinsFromDB, saveDailyCheckin } from '../utils/supabaseData';

// Load check-ins on mount
useEffect(() => {
  const loadCheckins = async () => {
    if (!user) return;
    const checkins = await loadDailyCheckinsFromDB();
    setDailyCheckins(checkins);
  };
  loadCheckins();
}, [user]);

// Save check-in
const handleCheckinSave = async () => {
  if (checkinText.trim()) {
    await saveDailyCheckin(today, question, checkinText);
    const updated = await loadDailyCheckinsFromDB();
    setDailyCheckins(updated);
  }
};
```

#### C. IntentionsList.jsx
**Current**: Uses `loadFromStorage('bloomroom_intentions')` and `saveToStorage()`  
**Update to**: Use functions from `supabaseData.js`

**Key Changes**:
```javascript
// Add imports
import { loadIntentionsFromDB, saveIntention, updateIntention, deleteIntention } from '../utils/supabaseData';

// Load intentions on mount
useEffect(() => {
  const loadData = async () => {
    if (!user) return;
    const data = await loadIntentionsFromDB();
    setIntentions(data);
  };
  loadData();
}, [user]);

// Add new intention
const handleAdd = async (text) => {
  await saveIntention(text);
  const updated = await loadIntentionsFromDB();
  setIntentions(updated);
};
```

#### D. QuickNotes.jsx (if exists)
Similar pattern to IntentionsList - use `loadQuickNotesFromDB()`, `saveQuickNote()`, etc.

---

## 📋 Component Update Checklist

- [ ] Run `supabase_complete_setup.sql` in Supabase dashboard
- [ ] Verify tables created successfully
- [ ] Update MemoryCorner.jsx to use Supabase
- [ ] Update CareRoom.jsx to use Supabase
- [ ] Update IntentionsList.jsx to use Supabase
- [ ] Update QuickNotes component (if exists)
- [ ] Test each component with authentication
- [ ] Verify data persists across page refreshes
- [ ] Test cross-device sync

---

## 🔄 Data Migration (Optional)

If you have existing data in localStorage that you want to migrate to Supabase, you can:

1. Sign in to the app
2. Open browser console
3. Run migration commands manually:

```javascript
// Example: Migrate journal entries
const entries = JSON.parse(localStorage.getItem('bloomroom_journal') || '[]');
for (const entry of entries) {
  await saveJournalEntry(entry.date, entry.text, entry.image);
}
```

Or create a migration button in your app that runs the migration once.

---

## ✅ Benefits After Migration

- **Cross-Device Sync**: All data syncs across devices automatically
- **No Data Loss**: Data stored in cloud database, not browser
- **Better Performance**: Proper database queries instead of localStorage
- **Scalable**: No 5-10MB localStorage limits
- **Secure**: Row-level security ensures users only see their own data

---

## 🐛 Troubleshooting

### "Not authenticated" errors
- Make sure user is signed in
- Check that Supabase credentials in `.env` are correct

### Data not loading
- Check browser console for errors
- Verify SQL setup ran successfully
- Check RLS policies are enabled

### Images not uploading
- Ensure `user-images` storage bucket exists
- Verify storage policies are set up
- Check that user is authenticated

---

## 📝 Next Steps

1. **Run SQL setup** - This is the most critical step
2. **Update one component at a time** - Start with MemoryCorner
3. **Test thoroughly** - Verify each component works before moving to next
4. **Deploy** - Once all components updated, deploy to production

Need help with component updates? Let me know which component to update first and I can provide the complete updated code!
