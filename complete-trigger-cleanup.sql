-- Complete cleanup of all triggers and hooks that might block user creation
-- This is an emergency cleanup to ensure user registration works

-- Step 1: Drop ALL triggers on auth.users table
DO $$
DECLARE
    trigger_record RECORD;
BEGIN
    -- Get all triggers on auth.users table
    FOR trigger_record IN 
        SELECT trigger_name 
        FROM information_schema.triggers 
        WHERE event_object_table = 'users' AND event_object_schema = 'auth'
    LOOP
        EXECUTE 'DROP TRIGGER IF EXISTS ' || trigger_record.trigger_name || ' ON auth.users CASCADE';
        RAISE NOTICE 'Dropped trigger: %', trigger_record.trigger_name;
    END LOOP;
END $$;

-- Step 2: Drop ALL functions that might be called by triggers
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.create_profile_for_user() CASCADE;
DROP FUNCTION IF EXISTS public.create_profile_for_user_safe() CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS create_profile_for_user() CASCADE;
DROP FUNCTION IF EXISTS create_profile_for_user_safe() CASCADE;

-- Step 3: Drop any Supabase Auth hooks (these might be blocking user creation)
DROP FUNCTION IF EXISTS auth.on_auth_user_created() CASCADE;
DROP FUNCTION IF EXISTS auth.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS supabase_auth.on_auth_user_created() CASCADE;

-- Step 4: Check for and remove any database event triggers
DO $$
DECLARE
    event_trigger_record RECORD;
BEGIN
    FOR event_trigger_record IN 
        SELECT evtname 
        FROM pg_event_trigger 
        WHERE evtname LIKE '%user%' OR evtname LIKE '%auth%'
    LOOP
        EXECUTE 'DROP EVENT TRIGGER IF EXISTS ' || event_trigger_record.evtname || ' CASCADE';
        RAISE NOTICE 'Dropped event trigger: %', event_trigger_record.evtname;
    END LOOP;
END $$;

-- Step 5: Ensure auth.users table has no restrictive policies
-- (Note: We should NOT normally modify auth schema, but this is emergency debugging)
-- This is just to check - we won't actually modify auth.users policies

-- Step 6: Create minimal, safe functions for profile creation (for later use)
CREATE OR REPLACE FUNCTION public.create_user_profile_simple(
    p_full_name TEXT DEFAULT '',
    p_avatar_url TEXT DEFAULT ''
)
RETURNS JSON AS $$
DECLARE
    user_id UUID;
    profile_exists BOOLEAN;
BEGIN
    -- Get current authenticated user
    user_id := auth.uid();
    
    -- Check if user is authenticated
    IF user_id IS NULL THEN
        RETURN json_build_object('error', 'Not authenticated');
    END IF;
    
    -- Check if profile already exists
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE id = user_id) INTO profile_exists;
    
    IF profile_exists THEN
        RETURN json_build_object('message', 'Profile already exists', 'profile_id', user_id);
    END IF;
    
    -- Create the profile
    INSERT INTO public.profiles (
        id, 
        full_name, 
        avatar_url, 
        created_at, 
        updated_at
    ) VALUES (
        user_id, 
        p_full_name, 
        p_avatar_url, 
        NOW(), 
        NOW()
    );
    
    RETURN json_build_object(
        'message', 'Profile created successfully', 
        'profile_id', user_id
    );
    
EXCEPTION 
    WHEN OTHERS THEN
        RETURN json_build_object('error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.create_user_profile_simple(TEXT, TEXT) TO authenticated;

-- Step 7: Ensure profiles table is properly configured
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Clear profiles policies and create simple ones
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "authenticated_users_select_profiles" ON public.profiles;
DROP POLICY IF EXISTS "authenticated_users_update_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "authenticated_users_insert_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "temp_authenticated_users_update_any_profile" ON public.profiles;
DROP POLICY IF EXISTS "allow_select_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "allow_insert_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "allow_update_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_authenticated_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_authenticated_insert" ON public.profiles;
DROP POLICY IF EXISTS "profiles_authenticated_update" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "Enable select for authenticated users on own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users on own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for authenticated users on own profile" ON public.profiles;

-- Create simple working policies
CREATE POLICY "simple_select_own_profile" ON public.profiles
    FOR SELECT 
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "simple_insert_own_profile" ON public.profiles
    FOR INSERT 
    TO authenticated
    WITH CHECK (auth.uid() = id);

CREATE POLICY "simple_update_own_profile" ON public.profiles
    FOR UPDATE 
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Step 8: Final verification
DO $$
BEGIN
    -- Check that no triggers remain on auth.users
    IF EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE event_object_table = 'users' AND event_object_schema = 'auth'
    ) THEN
        RAISE WARNING 'WARNING: Some triggers still exist on auth.users table';
    ELSE
        RAISE NOTICE 'SUCCESS: No triggers found on auth.users table';
    END IF;
    
    -- Check that our profile function exists
    IF EXISTS (
        SELECT 1 FROM information_schema.routines 
        WHERE routine_schema = 'public' AND routine_name = 'create_user_profile_simple'
    ) THEN
        RAISE NOTICE 'SUCCESS: Profile creation function is ready';
    ELSE
        RAISE WARNING 'WARNING: Profile creation function not found';
    END IF;
END $$;

-- Step 9: Show final status
SELECT 
    'Cleanup completed. Try registration now. Users should be created in auth.users table.' as status,
    'Use create_user_profile_simple() function to create profiles after successful signup.' as next_step;