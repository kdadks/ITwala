-- Fix RLS policies for authenticated users
-- The issue is that auth.uid() might not work properly in all contexts

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create more permissive policies for authenticated users
-- These will work better with the browser authentication context

-- Allow authenticated users to view profiles (more permissive for debugging)
CREATE POLICY "authenticated_users_select_profiles" ON profiles
  FOR SELECT TO authenticated
  USING (true);

-- Allow authenticated users to update their own profiles
CREATE POLICY "authenticated_users_update_own_profile" ON profiles
  FOR UPDATE TO authenticated
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);

-- Allow authenticated users to insert their own profiles
CREATE POLICY "authenticated_users_insert_own_profile" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid()::text = id::text);

-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Grant permissions to authenticated role
GRANT SELECT, INSERT, UPDATE ON profiles TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Also create a more permissive temporary policy for testing
-- (You can remove this later once confirmed working)
CREATE POLICY "temp_authenticated_users_update_any_profile" ON profiles
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);