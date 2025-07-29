-- Fix for registration database error
-- This fixes the trigger that creates profiles when users register

-- First, ensure the profiles table has proper RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "authenticated_users_select_profiles" ON profiles;
DROP POLICY IF EXISTS "authenticated_users_update_own_profile" ON profiles;
DROP POLICY IF EXISTS "authenticated_users_insert_own_profile" ON profiles;
DROP POLICY IF EXISTS "temp_authenticated_users_update_any_profile" ON profiles;

-- Create proper RLS policies for profiles table
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON TABLE profiles TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Fix the trigger function to handle permissions properly
CREATE OR REPLACE FUNCTION public.create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert profile with proper security context
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN new;
EXCEPTION 
  WHEN OTHERS THEN
    -- Log the error but don't fail the user registration
    RAISE WARNING 'Failed to create profile for user %: %', new.id, SQLERRM;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists and is properly configured
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_profile_for_user();

-- Additional safety: Create a function to manually create missing profiles
CREATE OR REPLACE FUNCTION public.ensure_profile_exists(user_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  SELECT user_id, '', ''
  WHERE NOT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the helper function
GRANT EXECUTE ON FUNCTION public.ensure_profile_exists(UUID) TO authenticated;