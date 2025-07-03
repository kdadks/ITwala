-- Fix registration with profile assignment working together
-- This ensures both signup and profile creation work reliably

-- Step 1: Drop existing trigger to recreate it properly
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_safe ON auth.users;

-- Step 2: Create a robust profile creation function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    profile_name TEXT;
    profile_avatar TEXT;
BEGIN
    -- Extract metadata with proper null handling
    profile_name := COALESCE(NEW.raw_user_meta_data->>'full_name', '');
    profile_avatar := COALESCE(NEW.raw_user_meta_data->>'avatar_url', '');
    
    -- Create profile with comprehensive error handling
    BEGIN
        INSERT INTO public.profiles (
            id, 
            full_name, 
            avatar_url, 
            created_at, 
            updated_at
        ) VALUES (
            NEW.id,
            profile_name,
            profile_avatar,
            NOW(),
            NOW()
        );
        
        RAISE LOG 'Profile created successfully for user %', NEW.id;
        
    EXCEPTION 
        WHEN unique_violation THEN
            -- Profile already exists, update it instead
            UPDATE public.profiles 
            SET 
                full_name = COALESCE(profile_name, full_name),
                avatar_url = COALESCE(profile_avatar, avatar_url),
                updated_at = NOW()
            WHERE id = NEW.id;
            
            RAISE LOG 'Profile updated for existing user %', NEW.id;
            
        WHEN OTHERS THEN
            -- Log the error but don't fail the user creation
            RAISE WARNING 'Failed to create profile for user %: % %', NEW.id, SQLSTATE, SQLERRM;
            
            -- Insert a minimal profile to ensure the user has one
            BEGIN
                INSERT INTO public.profiles (id, full_name, created_at, updated_at)
                VALUES (NEW.id, '', NOW(), NOW())
                ON CONFLICT (id) DO NOTHING;
            EXCEPTION 
                WHEN OTHERS THEN
                    RAISE WARNING 'Failed to create minimal profile for user %: % %', NEW.id, SQLSTATE, SQLERRM;
            END;
    END;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Ensure proper permissions on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Clear existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "authenticated_users_select_profiles" ON profiles;
DROP POLICY IF EXISTS "authenticated_users_update_own_profile" ON profiles;
DROP POLICY IF EXISTS "authenticated_users_insert_own_profile" ON profiles;
DROP POLICY IF EXISTS "temp_authenticated_users_update_any_profile" ON profiles;
DROP POLICY IF EXISTS "allow_select_own_profile" ON profiles;
DROP POLICY IF EXISTS "allow_insert_own_profile" ON profiles;
DROP POLICY IF EXISTS "allow_update_own_profile" ON profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;

-- Create reliable RLS policies
CREATE POLICY "profiles_authenticated_select" ON profiles
    FOR SELECT 
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "profiles_authenticated_insert" ON profiles
    FOR INSERT 
    TO authenticated
    WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_authenticated_update" ON profiles
    FOR UPDATE 
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON profiles TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Step 4: Create the trigger with the new function
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Step 5: Create a helper function for manual profile creation (as backup)
CREATE OR REPLACE FUNCTION public.ensure_user_profile(
    user_id UUID DEFAULT NULL,
    full_name TEXT DEFAULT '',
    avatar_url TEXT DEFAULT ''
)
RETURNS JSON AS $$
DECLARE
    target_user_id UUID;
    profile_exists BOOLEAN;
BEGIN
    -- Use provided user_id or current authenticated user
    target_user_id := COALESCE(user_id, auth.uid());
    
    -- Check if user is authenticated
    IF target_user_id IS NULL THEN
        RETURN json_build_object('error', 'Not authenticated');
    END IF;
    
    -- Check if profile exists
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE id = target_user_id) INTO profile_exists;
    
    IF profile_exists THEN
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

-- Grant execute permission on the helper function
GRANT EXECUTE ON FUNCTION public.ensure_user_profile(UUID, TEXT, TEXT) TO authenticated;

-- Step 6: Test the setup by checking if everything is in place
DO $$
BEGIN
    -- Check if trigger exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_name = 'on_auth_user_created'
    ) THEN
        RAISE WARNING 'Trigger on_auth_user_created was not created properly';
    ELSE
        RAISE NOTICE 'Trigger on_auth_user_created created successfully';
    END IF;
    
    -- Check if function exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.routines 
        WHERE routine_name = 'handle_new_user'
    ) THEN
        RAISE WARNING 'Function handle_new_user was not created properly';
    ELSE
        RAISE NOTICE 'Function handle_new_user created successfully';
    END IF;
END $$;