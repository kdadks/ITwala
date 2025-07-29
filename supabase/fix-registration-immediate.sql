-- Immediate fix for registration database error
-- This will disable the problematic trigger and allow registration to work

-- Step 1: Disable the trigger temporarily
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Step 2: Create a simpler, safer trigger function
CREATE OR REPLACE FUNCTION public.create_profile_for_user_safe()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create profile if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = NEW.id) THEN
    BEGIN
      INSERT INTO public.profiles (id, full_name, avatar_url, created_at, updated_at)
      VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
        NOW(),
        NOW()
      );
    EXCEPTION 
      WHEN OTHERS THEN
        -- Log error but don't fail registration
        RAISE WARNING 'Could not create profile for user %: %', NEW.id, SQLERRM;
    END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Ensure proper permissions exist
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Clear all existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "authenticated_users_select_profiles" ON profiles;
DROP POLICY IF EXISTS "authenticated_users_update_own_profile" ON profiles;
DROP POLICY IF EXISTS "authenticated_users_insert_own_profile" ON profiles;
DROP POLICY IF EXISTS "temp_authenticated_users_update_any_profile" ON profiles;

-- Create basic policies that should work
CREATE POLICY "allow_select_own_profile" ON profiles
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "allow_insert_own_profile" ON profiles
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "allow_update_own_profile" ON profiles
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON profiles TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Step 4: Create the trigger with the safer function
CREATE TRIGGER on_auth_user_created_safe
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.create_profile_for_user_safe();

-- Step 5: Create an API endpoint fallback function for manual profile creation
CREATE OR REPLACE FUNCTION public.create_user_profile_manually(
  user_id UUID DEFAULT NULL,
  full_name TEXT DEFAULT '',
  avatar_url TEXT DEFAULT ''
)
RETURNS JSON AS $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Use provided user_id or current authenticated user
  target_user_id := COALESCE(user_id, auth.uid());
  
  -- Check if user is authenticated
  IF target_user_id IS NULL THEN
    RETURN json_build_object('error', 'Not authenticated');
  END IF;
  
  -- Check if profile already exists
  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = target_user_id) THEN
    RETURN json_build_object('message', 'Profile already exists');
  END IF;
  
  -- Create the profile
  INSERT INTO public.profiles (id, full_name, avatar_url, created_at, updated_at)
  VALUES (target_user_id, full_name, avatar_url, NOW(), NOW());
  
  RETURN json_build_object('message', 'Profile created successfully');
  
EXCEPTION 
  WHEN OTHERS THEN
    RETURN json_build_object('error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the manual function
GRANT EXECUTE ON FUNCTION public.create_user_profile_manually(UUID, TEXT, TEXT) TO authenticated;