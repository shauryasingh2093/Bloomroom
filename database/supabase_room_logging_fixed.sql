-- =====================================================
-- Room Activity Logging - Fixed Version
-- Handles existing policies gracefully
-- =====================================================

-- =====================================================
-- 1. ROOM VISITS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS room_visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  room_name TEXT NOT NULL CHECK (room_name IN ('planning', 'future', 'care', 'memory', 'calm')),
  visit_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  visit_end TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  activities JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_room_visits_user ON room_visits(user_id, visit_start DESC);
CREATE INDEX IF NOT EXISTS idx_room_visits_room ON room_visits(room_name, visit_start DESC);
CREATE INDEX IF NOT EXISTS idx_room_visits_user_room ON room_visits(user_id, room_name, visit_start DESC);

-- Enable RLS
ALTER TABLE room_visits ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then recreate
DROP POLICY IF EXISTS "Users can view their own room visits" ON room_visits;
DROP POLICY IF EXISTS "Users can insert their own room visits" ON room_visits;
DROP POLICY IF EXISTS "Users can update their own room visits" ON room_visits;

-- Create policies
CREATE POLICY "Users can view their own room visits" ON room_visits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own room visits" ON room_visits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own room visits" ON room_visits
  FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================
-- 2. DAILY ACTIVITY TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS daily_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_date DATE NOT NULL,
  total_time_seconds INTEGER DEFAULT 0,
  rooms_visited TEXT[] DEFAULT '{}',
  tasks_completed INTEGER DEFAULT 0,
  goals_added INTEGER DEFAULT 0,
  journal_entries INTEGER DEFAULT 0,
  checkins_completed INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, activity_date)
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_daily_activity_user_date ON daily_activity(user_id, activity_date DESC);

-- Enable RLS
ALTER TABLE daily_activity ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then recreate
DROP POLICY IF EXISTS "Users can view their own daily activity" ON daily_activity;
DROP POLICY IF EXISTS "Users can insert their own daily activity" ON daily_activity;
DROP POLICY IF EXISTS "Users can update their own daily activity" ON daily_activity;

-- Create policies
CREATE POLICY "Users can view their own daily activity" ON daily_activity
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily activity" ON daily_activity
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily activity" ON daily_activity
  FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================
-- 3. HELPER FUNCTION & TRIGGER
-- =====================================================

-- Drop existing function and trigger if they exist
DROP TRIGGER IF EXISTS trigger_update_daily_activity ON room_visits;
DROP FUNCTION IF EXISTS update_daily_activity();

-- Create function
CREATE OR REPLACE FUNCTION update_daily_activity()
RETURNS TRIGGER AS $$
BEGIN
  -- Update daily activity summary when room visit ends
  IF NEW.visit_end IS NOT NULL AND NEW.duration_seconds IS NOT NULL THEN
    INSERT INTO daily_activity (
      user_id,
      activity_date,
      total_time_seconds,
      rooms_visited
    )
    VALUES (
      NEW.user_id,
      DATE(NEW.visit_start),
      NEW.duration_seconds,
      ARRAY[NEW.room_name]
    )
    ON CONFLICT (user_id, activity_date)
    DO UPDATE SET
      total_time_seconds = daily_activity.total_time_seconds + NEW.duration_seconds,
      rooms_visited = CASE 
        WHEN NEW.room_name = ANY(daily_activity.rooms_visited) 
        THEN daily_activity.rooms_visited
        ELSE array_append(daily_activity.rooms_visited, NEW.room_name)
      END,
      updated_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER trigger_update_daily_activity
  AFTER INSERT OR UPDATE ON room_visits
  FOR EACH ROW
  EXECUTE FUNCTION update_daily_activity();

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Check tables
SELECT 'Tables created:' as status;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('room_visits', 'daily_activity');

-- Check policies
SELECT 'Policies created:' as status;
SELECT tablename, policyname FROM pg_policies 
WHERE tablename IN ('room_visits', 'daily_activity')
ORDER BY tablename, policyname;

-- Success message
SELECT '✅ Room logging setup complete!' as status;
