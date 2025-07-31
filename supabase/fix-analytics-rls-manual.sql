-- Manual RLS fix for analytics tables
-- Run this in Supabase Dashboard > SQL Editor

-- First, check what policies currently exist
SELECT 
    schemaname,
    tablename, 
    policyname, 
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('user_sessions', 'page_views')
ORDER BY tablename, policyname;

-- Drop ALL existing policies on both tables
DROP POLICY IF EXISTS "Allow analytics tracking" ON user_sessions;
DROP POLICY IF EXISTS "Allow analytics session tracking" ON user_sessions;
DROP POLICY IF EXISTS "Users can view own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Users can insert own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Users can update own sessions" ON user_sessions;
DROP POLICY IF EXISTS "User sessions policy" ON user_sessions;

DROP POLICY IF EXISTS "Allow analytics tracking" ON page_views;
DROP POLICY IF EXISTS "Users can view own page views" ON page_views;
DROP POLICY IF EXISTS "Users can insert own page views" ON page_views;
DROP POLICY IF EXISTS "Page views policy" ON page_views;

-- Ensure RLS is enabled (but create permissive policies)
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Create completely open policies for analytics
CREATE POLICY "analytics_full_access" ON user_sessions
    FOR ALL 
    TO anon, authenticated, service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "analytics_full_access" ON page_views
    FOR ALL 
    TO anon, authenticated, service_role
    USING (true)
    WITH CHECK (true);

-- Verify the policies were created correctly
SELECT 
    tablename, 
    policyname, 
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('user_sessions', 'page_views')
ORDER BY tablename, policyname;

-- Test that anon can insert into both tables
-- This should work without errors:

-- Test insert into user_sessions
INSERT INTO user_sessions (
    session_id,
    user_id,
    user_agent,
    first_page,
    last_page,
    total_pages,
    created_at,
    updated_at
) VALUES (
    'test_manual_' || extract(epoch from now()),
    null,
    'Manual Test Agent',
    '/test',
    '/test',
    1,
    now(),
    now()
) RETURNING id, session_id;

-- Test insert into page_views  
INSERT INTO page_views (
    user_id,
    session_id,
    page_url,
    page_title,
    user_agent,
    country,
    device_type,
    browser,
    created_at
) VALUES (
    null,
    'test_manual_' || extract(epoch from now()),
    '/test',
    'Manual Test',
    'Manual Test Agent',
    'Unknown',
    'desktop',
    'Chrome',
    now()
) RETURNING id, session_id;

-- Clean up test data
DELETE FROM user_sessions WHERE session_id LIKE 'test_manual_%';
DELETE FROM page_views WHERE session_id LIKE 'test_manual_%';
