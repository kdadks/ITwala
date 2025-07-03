-- Fix enrollment profile update issues
-- Ensure profiles can be updated during enrollment process

-- Step 1: Check if profiles table has all the required columns
DO $$
DECLARE
    missing_columns TEXT[] := ARRAY[]::TEXT[];
BEGIN
    -- Check for address column (for backward compatibility)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'address'
    ) THEN
        missing_columns := array_append(missing_columns, 'address');
    END IF;
    
    -- Check for role column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'role'
    ) THEN
        missing_columns := array_append(missing_columns, 'role');
    END IF;
    
    -- Add missing columns if needed
    IF array_length(missing_columns, 1) > 0 THEN
        IF 'address' = ANY(missing_columns) THEN
            ALTER TABLE public.profiles ADD COLUMN address TEXT DEFAULT '';
            RAISE NOTICE 'Added address column to profiles table';
        END IF;
        
        IF 'role' = ANY(missing_columns) THEN
            ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'student';
            RAISE NOTICE 'Added role column to profiles table';
        END IF;
    ELSE
        RAISE NOTICE 'All required columns exist in profiles table';
    END IF;
END $$;

-- Step 2: Ensure RLS policies allow profile updates during enrollment
-- Drop existing policies
DROP POLICY IF EXISTS "simple_select_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "simple_insert_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "simple_update_own_profile" ON public.profiles;

-- Create enhanced policies that allow enrollment updates
CREATE POLICY "profiles_select_policy" ON public.profiles
    FOR SELECT 
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "profiles_insert_policy" ON public.profiles
    FOR INSERT 
    TO authenticated
    WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_policy" ON public.profiles
    FOR UPDATE 
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Step 3: Grant necessary permissions for enrollment updates
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Step 4: Create a function specifically for enrollment profile updates
CREATE OR REPLACE FUNCTION public.update_profile_for_enrollment(
    p_full_name TEXT DEFAULT NULL,
    p_phone TEXT DEFAULT NULL,
    p_address TEXT DEFAULT NULL,
    p_address_line1 TEXT DEFAULT NULL,
    p_address_line2 TEXT DEFAULT NULL,
    p_city TEXT DEFAULT NULL,
    p_state TEXT DEFAULT NULL,
    p_country TEXT DEFAULT NULL,
    p_pincode TEXT DEFAULT NULL,
    p_highest_qualification TEXT DEFAULT NULL,
    p_degree_name TEXT DEFAULT NULL,
    p_has_laptop BOOLEAN DEFAULT NULL,
    p_role TEXT DEFAULT 'student'
)
RETURNS JSON AS $$
DECLARE
    user_id UUID;
    update_data JSONB := '{}'::JSONB;
BEGIN
    -- Get current authenticated user
    user_id := auth.uid();
    
    -- Check if user is authenticated
    IF user_id IS NULL THEN
        RETURN json_build_object('error', 'Not authenticated');
    END IF;
    
    -- Build update data dynamically (only update non-null values)
    IF p_full_name IS NOT NULL THEN
        update_data := update_data || jsonb_build_object('full_name', p_full_name);
    END IF;
    
    IF p_phone IS NOT NULL THEN
        update_data := update_data || jsonb_build_object('phone', p_phone);
    END IF;
    
    IF p_address IS NOT NULL THEN
        update_data := update_data || jsonb_build_object('address', p_address);
    END IF;
    
    IF p_address_line1 IS NOT NULL THEN
        update_data := update_data || jsonb_build_object('address_line1', p_address_line1);
    END IF;
    
    IF p_address_line2 IS NOT NULL THEN
        update_data := update_data || jsonb_build_object('address_line2', p_address_line2);
    END IF;
    
    IF p_city IS NOT NULL THEN
        update_data := update_data || jsonb_build_object('city', p_city);
    END IF;
    
    IF p_state IS NOT NULL THEN
        update_data := update_data || jsonb_build_object('state', p_state);
    END IF;
    
    IF p_country IS NOT NULL THEN
        update_data := update_data || jsonb_build_object('country', p_country);
    END IF;
    
    IF p_pincode IS NOT NULL THEN
        update_data := update_data || jsonb_build_object('pincode', p_pincode);
    END IF;
    
    IF p_highest_qualification IS NOT NULL THEN
        update_data := update_data || jsonb_build_object('highest_qualification', p_highest_qualification);
    END IF;
    
    IF p_degree_name IS NOT NULL THEN
        update_data := update_data || jsonb_build_object('degree_name', p_degree_name);
    END IF;
    
    IF p_has_laptop IS NOT NULL THEN
        update_data := update_data || jsonb_build_object('has_laptop', p_has_laptop);
    END IF;
    
    IF p_role IS NOT NULL THEN
        update_data := update_data || jsonb_build_object('role', p_role);
    END IF;
    
    -- Always update the timestamp
    update_data := update_data || jsonb_build_object('updated_at', NOW());
    
    -- Perform the update using dynamic SQL
    EXECUTE format('
        UPDATE public.profiles 
        SET %s
        WHERE id = $1
    ', 
    (
        SELECT string_agg(
            quote_ident(key) || ' = ' || 
            CASE 
                WHEN jsonb_typeof(value) = 'string' THEN quote_literal(value #>> '{}')
                WHEN jsonb_typeof(value) = 'boolean' THEN (value #>> '{}')::boolean::text
                ELSE quote_literal(value #>> '{}')
            END, 
            ', '
        )
        FROM jsonb_each(update_data)
    )) USING user_id;
    
    RETURN json_build_object(
        'message', 'Profile updated successfully for enrollment',
        'user_id', user_id,
        'updated_fields', update_data
    );
    
EXCEPTION 
    WHEN OTHERS THEN
        RETURN json_build_object('error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the enrollment update function
GRANT EXECUTE ON FUNCTION public.update_profile_for_enrollment(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, BOOLEAN, TEXT) TO authenticated;

-- Step 5: Create a simpler direct update function for the API
CREATE OR REPLACE FUNCTION public.update_profile_direct(
    profile_updates JSONB
)
RETURNS JSON AS $$
DECLARE
    user_id UUID;
    sql_parts TEXT[] := ARRAY[]::TEXT[];
    key TEXT;
    value JSONB;
BEGIN
    -- Get current authenticated user
    user_id := auth.uid();
    
    -- Check if user is authenticated
    IF user_id IS NULL THEN
        RETURN json_build_object('error', 'Not authenticated');
    END IF;
    
    -- Build SQL parts for each field
    FOR key, value IN SELECT * FROM jsonb_each(profile_updates)
    LOOP
        IF key != 'updated_at' THEN -- We'll add updated_at separately
            sql_parts := array_append(sql_parts, 
                quote_ident(key) || ' = ' || 
                CASE 
                    WHEN jsonb_typeof(value) = 'string' THEN quote_literal(value #>> '{}')
                    WHEN jsonb_typeof(value) = 'boolean' THEN (value #>> '{}')::boolean::text
                    WHEN jsonb_typeof(value) = 'null' THEN 'NULL'
                    ELSE quote_literal(value #>> '{}')
                END
            );
        END IF;
    END LOOP;
    
    -- Add updated_at
    sql_parts := array_append(sql_parts, 'updated_at = NOW()');
    
    -- Execute the update
    IF array_length(sql_parts, 1) > 0 THEN
        EXECUTE format('UPDATE public.profiles SET %s WHERE id = $1', 
                      array_to_string(sql_parts, ', ')) 
        USING user_id;
    END IF;
    
    RETURN json_build_object(
        'message', 'Profile updated successfully',
        'user_id', user_id
    );
    
EXCEPTION 
    WHEN OTHERS THEN
        RETURN json_build_object('error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.update_profile_direct(JSONB) TO authenticated;

-- Step 6: Test the setup
DO $$
BEGIN
    -- Check if policies exist
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'profiles'
    ) THEN
        RAISE NOTICE 'SUCCESS: RLS policies configured for profiles table';
    ELSE
        RAISE WARNING 'ISSUE: No RLS policies found for profiles table';
    END IF;
    
    -- Check if update functions exist
    IF EXISTS (
        SELECT 1 FROM information_schema.routines 
        WHERE routine_schema = 'public' AND routine_name = 'update_profile_for_enrollment'
    ) THEN
        RAISE NOTICE 'SUCCESS: update_profile_for_enrollment function created';
    ELSE
        RAISE WARNING 'ISSUE: update_profile_for_enrollment function not created';
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM information_schema.routines 
        WHERE routine_schema = 'public' AND routine_name = 'update_profile_direct'
    ) THEN
        RAISE NOTICE 'SUCCESS: update_profile_direct function created';
    ELSE
        RAISE WARNING 'ISSUE: update_profile_direct function not created';
    END IF;
END $$;