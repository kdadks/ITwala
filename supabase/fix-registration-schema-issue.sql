-- Fix registration by ensuring trigger references correct schema
-- The profiles table exists but the trigger may be looking in wrong schema

-- Step 1: Drop existing trigger to recreate it properly
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_safe ON auth.users;

-- Step 2: Drop existing functions
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.create_profile_for_user();
DROP FUNCTION IF EXISTS public.create_profile_for_user_safe();

-- Step 3: Create a robust profile creation function with explicit schema references
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    profile_name TEXT;
    profile_avatar TEXT;
BEGIN
    -- Extract metadata with proper null handling
    profile_name := COALESCE(NEW.raw_user_meta_data->>'full_name', '');
    profile_avatar := COALESCE(NEW.raw_user_meta_data->>'avatar_url', '');
    
    -- Create profile with explicit schema reference
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
                
                RAISE LOG 'Created minimal profile for user %', NEW.id;
            EXCEPTION 
                WHEN OTHERS THEN
                    RAISE WARNING 'Failed to create minimal profile for user %: % %', NEW.id, SQLSTATE, SQLERRM;
            END;
    END;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Ensure proper permissions on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Clear existing policies
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

-- Create simple, reliable RLS policies
CREATE POLICY "profiles_select_own" ON public.profiles
    FOR SELECT 
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON public.profiles
    FOR INSERT 
    TO authenticated
    WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
    FOR UPDATE 
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Grant necessary permissions with explicit schema
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Step 5: Create the trigger with explicit schema references
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Step 6: Test the setup
DO $$
BEGIN
    -- Test if we can see the profiles table
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'profiles'
    ) THEN
        RAISE NOTICE 'profiles table found in public schema';
    ELSE
        RAISE WARNING 'profiles table not found in public schema';
    END IF;
    
    -- Test if trigger was created
    IF EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_name = 'on_auth_user_created'
    ) THEN
        RAISE NOTICE 'Trigger on_auth_user_created created successfully';
    ELSE
        RAISE WARNING 'Failed to create trigger on_auth_user_created';
    END IF;
    
    -- Test if function was created
    IF EXISTS (
        SELECT 1 FROM information_schema.routines 
        WHERE routine_schema = 'public' AND routine_name = 'handle_new_user'
    ) THEN
        RAISE NOTICE 'Function handle_new_user created successfully';
    ELSE
        RAISE WARNING 'Failed to create function handle_new_user';
    END IF;
END $$;

-- Step 7: Create a helper function for manual profile creation
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
    
    -- Check if profile exists with explicit schema reference
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE id = target_user_id) INTO profile_exists;
    
    IF profile_exists THEN
        RETURN json_build_object('message', 'Profile already exists');
    END IF;
    
    -- Create the profile with explicit schema reference
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