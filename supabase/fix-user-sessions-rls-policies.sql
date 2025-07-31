-- Fix RLS policies for user_sessions table to allow analytics tracking

-- Check current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'user_sessions';

-- Drop existing restrictive policies if they exist
DROP POLICY IF EXISTS "Users can view own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Users can insert own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Users can update own sessions" ON user_sessions;

-- Create permissive policy for analytics tracking
-- This allows both anonymous and authenticated users to track sessions
CREATE POLICY "Allow analytics session tracking" ON user_sessions
FOR ALL 
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Verify the new policy was created
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies 
WHERE tablename = 'user_sessions';
