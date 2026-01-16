-- =====================================================
-- Bloomroom Supabase Storage Setup
-- Run this in your Supabase SQL Editor
-- =====================================================

-- 1. Create storage bucket for user images
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-images', 'user-images', false)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage Policies for authenticated users

-- Allow authenticated users to upload their own images
CREATE POLICY "Users can upload their own images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'user-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to read their own images
CREATE POLICY "Users can read their own images"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'user-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update their own images
CREATE POLICY "Users can update their own images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'user-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own images
CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'user-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- =====================================================
-- Optional: Create dedicated user_images table
-- (You can skip this if you prefer to use user_data table)
-- =====================================================

CREATE TABLE IF NOT EXISTS user_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  image_type TEXT NOT NULL CHECK (image_type IN ('vision_board', 'journal_entry')),
  storage_path TEXT NOT NULL,
  public_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_user_images_user_id ON user_images(user_id);
CREATE INDEX IF NOT EXISTS idx_user_images_type ON user_images(image_type);
CREATE INDEX IF NOT EXISTS idx_user_images_user_type ON user_images(user_id, image_type);

-- Enable Row Level Security
ALTER TABLE user_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_images table
CREATE POLICY "Users can view their own images"
ON user_images FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own images"
ON user_images FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own images"
ON user_images FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own images"
ON user_images FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- =====================================================
-- Verification Queries
-- =====================================================

-- Check if bucket was created
SELECT * FROM storage.buckets WHERE id = 'user-images';

-- Check storage policies
SELECT * FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%Users can%';

-- Check user_images table (if created)
SELECT * FROM user_images LIMIT 1;
