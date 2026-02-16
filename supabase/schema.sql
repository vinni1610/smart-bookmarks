-- ============================================
-- SMART BOOKMARKS DATABASE SCHEMA
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- BOOKMARKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- INDEXES
-- ============================================
-- Index for fast user lookup (most common query pattern)
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id 
ON bookmarks(user_id);

-- Index for sorting by creation date
CREATE INDEX IF NOT EXISTS idx_bookmarks_created_at 
ON bookmarks(user_id, created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on bookmarks table
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view only their own bookmarks
CREATE POLICY "Users can view their own bookmarks"
ON bookmarks
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can insert their own bookmarks
CREATE POLICY "Users can insert their own bookmarks"
ON bookmarks
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own bookmarks
CREATE POLICY "Users can update their own bookmarks"
ON bookmarks
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own bookmarks
CREATE POLICY "Users can delete their own bookmarks"
ON bookmarks
FOR DELETE
USING (auth.uid() = user_id);

-- ============================================
-- REALTIME PUBLICATION
-- ============================================

-- Enable realtime for bookmarks table
ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_bookmarks_updated_at
BEFORE UPDATE ON bookmarks
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
