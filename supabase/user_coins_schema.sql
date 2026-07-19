-- SQL Script for creating the user_coins table in Supabase
-- Run this inside the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS user_coins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    coin_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    -- Unique constraint preventing a user from tracking the same coin multiple times
    UNIQUE (user_email, coin_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE user_coins ENABLE ROW LEVEL SECURITY;

-- Scope policy: Allows full access to SELECT, INSERT, and DELETE operations.
-- For a production scenario with Supabase Auth, you would typically use:
-- USING (auth.jwt() ->> 'email' = user_email)
-- For this unauthenticated operator network client demo, we allow queries and updates/deletions freely.
CREATE POLICY "Enable access to user_coins based on email"
    ON user_coins
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Index to optimize querying user lists
CREATE INDEX IF NOT EXISTS user_coins_user_email_idx ON user_coins (user_email);
