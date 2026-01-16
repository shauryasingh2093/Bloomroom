-- =====================================================
-- Bloomroom user_data Table & Policy Fix
-- Run this in your Supabase SQL Editor to fix 
-- vision board images reappearing after deletion
-- =====================================================

-- 1. Create user_data table if it doesn't exist
-- (This table is used for vision board, sync, and preferences)
CREATE TABLE IF NOT EXISTS user_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    key TEXT NOT NULL,
    value JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, key)
);

-- 2. Enable Row Level Security
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;

-- 3. Storage Policies (Gracefully handle existing ones)

-- DROP existing policies to ensure a clean state
DROP POLICY IF EXISTS "Users can view their own data" ON user_data;
DROP POLICY IF EXISTS "Users can insert their own data" ON user_data;
DROP POLICY IF EXISTS "Users can update their own data" ON user_data;
DROP POLICY IF EXISTS "Users can delete their own data" ON user_data;

-- Recreate policies
CREATE POLICY "Users can view their own data" 
ON user_data FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own data" 
ON user_data FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own data" 
ON user_data FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own data" 
ON user_data FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);

-- 4. Verification
SELECT '✅ user_data table and policies setup complete!' as status;
SELECT tablename, policyname FROM pg_policies WHERE tablename = 'user_data';
