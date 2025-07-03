-- Final solution: Remove problematic trigger and setup for frontend profile creation
-- This ensures signup works while enabling frontend to create profiles immediately after

-- Step 1: Remove all existing triggers that are causing issues
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_safe ON auth.users;

-- Step 2: Remove all trigger functions
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.create_profile_for_user();
DROP FUNCTION IF EXISTS public.create_profile_for_user_safe();

-- Step 3: Setup profiles table with proper permissions for frontend creation
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Clear all existing policies
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

-- Create simple, reliable policies for frontend access
CREATE POLICY "Enable select for authenticated users on own profile" ON public.profiles
    FOR SELECT 
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users on own profile" ON public.profiles
    FOR INSERT 
    TO authenticated
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for authenticated users on own profile" ON public.profiles
    FOR UPDATE 
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Step 4: Create a reliable function for profile creation that can be called from frontend
CREATE OR REPLACE FUNCTION public.create_user_profile(
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

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.create_user_profile(TEXT, TEXT) TO authenticated;

-- Step 5: Create an admin function for creating profiles (as backup)
CREATE OR REPLACE FUNCTION public.admin_create_profile(
    p_user_id UUID,
    p_full_name TEXT DEFAULT '',
    p_avatar_url TEXT DEFAULT ''
)
RETURNS JSON AS $$
DECLARE
    profile_exists BOOLEAN;
BEGIN
    -- Check if profile already exists
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE id = p_user_id) INTO profile_exists;
    
    IF profile_exists THEN
        RETURN json_build_object('message', 'Profile already exists', 'profile_id', p_user_id);
    END IF;
    
    -- Create the profile
    INSERT INTO public.profiles (
        id, 
        full_name, 
        avatar_url, 
        created_at, 
        updated_at
    ) VALUES (
        p_user_id, 
        p_full_name, 
        p_avatar_url, 
        NOW(), 
        NOW()
    );
    
    RETURN json_build_object(
        'message', 'Profile created successfully', 
        'profile_id', p_user_id
    );
    
EXCEPTION 
    WHEN OTHERS THEN
        RETURN json_build_object('error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 6: Verify setup
DO $$
BEGIN
    -- Check if profiles table exists
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'profiles'
    ) THEN
        RAISE NOTICE 'SUCCESS: profiles table found in public schema';
    ELSE
        RAISE WARNING 'ISSUE: profiles table not found in public schema';
    END IF;
    
    -- Check if no triggers exist (good - we removed them)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_name LIKE '%user_created%'
    ) THEN
        RAISE NOTICE 'SUCCESS: No problematic triggers found';
    ELSE
        RAISE WARNING 'ISSUE: Some user creation triggers still exist';
    END IF;
    
    -- Check if our function exists
    IF EXISTS (
        SELECT 1 FROM information_schema.routines 
        WHERE routine_schema = 'public' AND routine_name = 'create_user_profile'
    ) THEN
        RAISE NOTICE 'SUCCESS: create_user_profile function created';
    ELSE
        RAISE WARNING 'ISSUE: create_user_profile function not created';
    END IF;
END $$;