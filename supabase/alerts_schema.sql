-- SQL Script for creating the alerts table in Supabase
-- Run this inside the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    coin_id TEXT NOT NULL,
    target_price NUMERIC NOT NULL,
    direction TEXT NOT NULL CHECK (direction IN ('above', 'below')),
    triggered BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Scope policy: Allows full access to SELECT, INSERT, UPDATE, and DELETE operations.
-- For a production scenario with Supabase Auth, you would typically use:
-- USING (auth.jwt() ->> 'email' = user_email)
-- For this unauthenticated operator network client demo, we allow queries and insert/updates freely.
CREATE POLICY "Enable access to alerts based on email"
    ON alerts
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Index for speed on lookup filtering
CREATE INDEX IF NOT EXISTS alerts_user_email_triggered_idx ON alerts (user_email, triggered);
