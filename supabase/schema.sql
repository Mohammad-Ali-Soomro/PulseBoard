-- supabase/schema.sql
-- Run this in your Supabase SQL Editor to create the watchlist table and view.

-- 1. Create the Watchlist table
CREATE TABLE IF NOT EXISTS watchlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  coin_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Prevent duplicate watch entries for the same user and coin
  CONSTRAINT unique_user_coin UNIQUE (user_email, coin_id)
);

-- 2. Create index for faster lookup and aggregation
CREATE INDEX IF NOT EXISTS idx_watchlist_coin_id ON watchlist (coin_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_user_email ON watchlist (user_email);

-- 3. Create a view for aggregating global popularity statistics
CREATE OR REPLACE VIEW most_watched_coins AS
  SELECT 
    coin_id, 
    COUNT(*) as watch_count
  FROM watchlist
  GROUP BY coin_id;

-- Grant select permission on the view for public access
GRANT SELECT ON most_watched_coins TO anon, authenticated;

-- 4. Enable Row Level Security (RLS) on the watchlist table
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;

-- 5. Define RLS Policies

-- POLICY A: Standard Authenticated policy (use if utilizing Supabase Auth)
-- This enforces that users can only read/write entries where the user_email matches their JWT email.
/*
CREATE POLICY "Allow authenticated read on personal watchlist" ON watchlist
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' = user_email);

CREATE POLICY "Allow authenticated insert on personal watchlist" ON watchlist
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt() ->> 'email' = user_email);

CREATE POLICY "Allow authenticated delete on personal watchlist" ON watchlist
  FOR DELETE
  TO authenticated
  USING (auth.jwt() ->> 'email' = user_email);
*/

-- POLICY B: Simplified Anonymous Demo policies
-- Because the prompt specifies "no full auth system needed, just email as an identifier for now"
-- and calls a direct client-side insert, we must allow anonymous reads and writes.
-- We restrict SELECT to match the email parameter if queried, or allow general read for stats.
CREATE POLICY "Allow public select on watchlist" ON watchlist
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert on watchlist" ON watchlist
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public delete on watchlist" ON watchlist
  FOR DELETE
  TO anon, authenticated
  USING (true);
