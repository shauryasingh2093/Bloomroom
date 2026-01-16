-- =====================================================
-- Bloomroom Comprehensive Supabase Setup
-- Run this in your Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. JOURNAL ENTRIES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  entry_date DATE NOT NULL,
  text TEXT,
  image_url TEXT,
  image_path TEXT,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, entry_date)
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_date ON journal_entries(user_id, entry_date DESC);

-- Enable RLS
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own journal entries" ON journal_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own journal entries" ON journal_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journal entries" ON journal_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journal entries" ON journal_entries
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 2. DAILY CHECK-INS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS daily_checkins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  checkin_date DATE NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, checkin_date)
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_daily_checkins_user_date ON daily_checkins(user_id, checkin_date DESC);

-- Enable RLS
ALTER TABLE daily_checkins ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own check-ins" ON daily_checkins
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own check-ins" ON daily_checkins
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own check-ins" ON daily_checkins
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own check-ins" ON daily_checkins
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 3. INTENTIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS intentions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_intentions_user ON intentions(user_id, created_at DESC);

-- Enable RLS
ALTER TABLE intentions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own intentions" ON intentions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own intentions" ON intentions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own intentions" ON intentions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own intentions" ON intentions
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 4. QUICK NOTES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS quick_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_quick_notes_user ON quick_notes(user_id, created_at DESC);

-- Enable RLS
ALTER TABLE quick_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own quick notes" ON quick_notes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quick notes" ON quick_notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quick notes" ON quick_notes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own quick notes" ON quick_notes
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 5. USER SETTINGS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_target INTEGER DEFAULT 15,
  preferences JSONB DEFAULT '{}'::jsonb,
  streak_count INTEGER DEFAULT 0,
  streak_last_date DATE,
  streak_paused_until DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check if tables were created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('journal_entries', 'daily_checkins', 'intentions', 'quick_notes', 'user_settings');

-- Check RLS policies
SELECT tablename, policyname FROM pg_policies 
WHERE tablename IN ('journal_entries', 'daily_checkins', 'intentions', 'quick_notes', 'user_settings')
ORDER BY tablename, policyname;

-- Check indexes
SELECT tablename, indexname FROM pg_indexes 
WHERE tablename IN ('journal_entries', 'daily_checkins', 'intentions', 'quick_notes')
ORDER BY tablename;
