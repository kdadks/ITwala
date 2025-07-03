-- Clean up specific users by email addresses
-- This will remove users and all their associated records

-- Define the email addresses to be cleaned up
DO $$
DECLARE
    emails_to_delete TEXT[] := ARRAY[
        'prashant.srivastav@gmail.com',
        'info@raahirides.com', 
        'anugrah_sriva@outlook.com',
        'anaytheflash@gmail.com',
        'samiya.ahluwalia@gmail.com',
        'aiocean2050@gmail.com',
        'sales@it-wala.com',
        'kdadks@outlook.com'
    ];
    email_addr RECORD;
    user_ids UUID[];
    user_count INTEGER;
    deleted_progress INTEGER := 0;
    deleted_reviews INTEGER := 0;
    deleted_enrollments INTEGER := 0;
    deleted_profiles INTEGER := 0;
    deleted_auth_users INTEGER := 0;
BEGIN
    RAISE NOTICE '=== STARTING CLEANUP FOR SPECIFIC USERS ===';
    
    -- Get user IDs for the specified email addresses
    SELECT ARRAY_AGG(id) INTO user_ids
    FROM auth.users 
    WHERE email = ANY(emails_to_delete);
    
    IF user_ids IS NULL OR array_length(user_ids, 1) = 0 THEN
        RAISE NOTICE 'No users found with the specified email addresses';
        RETURN;
    END IF;
    
    user_count := array_length(user_ids, 1);
    RAISE NOTICE 'Found % users to delete', user_count;
    
    -- Show which users will be deleted
    RAISE NOTICE 'Users to be deleted:';
    FOR email_addr IN
        SELECT u.email
        FROM auth.users u
        WHERE u.email = ANY(emails_to_delete)
        ORDER BY u.email
    LOOP
        RAISE NOTICE '  - %', email_addr.email;
    END LOOP;
    
    -- Delete associated records first (to avoid foreign key constraints)
    
    -- Delete progress records (if table exists)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'progress') THEN
        DELETE FROM progress WHERE user_id = ANY(user_ids);
        GET DIAGNOSTICS deleted_progress = ROW_COUNT;
        RAISE NOTICE 'Deleted % progress records', deleted_progress;
    ELSE
        RAISE NOTICE 'Progress table does not exist, skipping';
    END IF;
    
    -- Delete reviews (if table exists)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'reviews') THEN
        DELETE FROM reviews WHERE user_id = ANY(user_ids);
        GET DIAGNOSTICS deleted_reviews = ROW_COUNT;
        RAISE NOTICE 'Deleted % reviews', deleted_reviews;
    ELSE
        RAISE NOTICE 'Reviews table does not exist, skipping';
    END IF;
    
    -- Delete enrollments (if table exists)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'enrollments') THEN
        DELETE FROM enrollments WHERE user_id = ANY(user_ids);
        GET DIAGNOSTICS deleted_enrollments = ROW_COUNT;
        RAISE NOTICE 'Deleted % enrollments', deleted_enrollments;
    ELSE
        RAISE NOTICE 'Enrollments table does not exist, skipping';
    END IF;
    
    -- Delete profiles (if table exists)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
        DELETE FROM public.profiles WHERE id = ANY(user_ids);
        GET DIAGNOSTICS deleted_profiles = ROW_COUNT;
        RAISE NOTICE 'Deleted % profiles', deleted_profiles;
    ELSE
        RAISE NOTICE 'Profiles table does not exist, skipping';
    END IF;
    
    -- Delete from auth.users table
    DELETE FROM auth.users WHERE email = ANY(emails_to_delete);
    GET DIAGNOSTICS deleted_auth_users = ROW_COUNT;
    RAISE NOTICE 'Deleted % auth users', deleted_auth_users;
    
    RAISE NOTICE '=== CLEANUP COMPLETED ===';
    RAISE NOTICE 'Summary:';
    RAISE NOTICE '  - Auth users deleted: %', deleted_auth_users;
    RAISE NOTICE '  - Profiles deleted: %', deleted_profiles;
    RAISE NOTICE '  - Enrollments deleted: %', deleted_enrollments;
    RAISE NOTICE '  - Reviews deleted: %', deleted_reviews;
    RAISE NOTICE '  - Progress records deleted: %', deleted_progress;
    RAISE NOTICE '========================';
    
EXCEPTION 
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error during cleanup: %', SQLERRM;
END $$;

-- Verification: Check that the specified users are gone
DO $$
DECLARE
    remaining_users INTEGER;
    email_addr RECORD;
    emails_to_check TEXT[] := ARRAY[
        'prashant.srivastav@gmail.com',
        'info@raahirides.com',
        'anugrah_sriva@outlook.com',
        'anaytheflash@gmail.com',
        'samiya.ahluwalia@gmail.com',
        'aiocean2050@gmail.com',
        'sales@it-wala.com',
        'kdadks@outlook.com'
    ];
BEGIN
    SELECT COUNT(*) INTO remaining_users
    FROM auth.users 
    WHERE email = ANY(emails_to_check);
    
    RAISE NOTICE '=== VERIFICATION ===';
    RAISE NOTICE 'Remaining users with specified emails: %', remaining_users;
    
    IF remaining_users = 0 THEN
        RAISE NOTICE 'SUCCESS: All specified users have been removed';
    ELSE
        RAISE WARNING 'WARNING: Some specified users still exist';
        
        -- Show which users still exist
        RAISE NOTICE 'Still existing users:';
        FOR email_addr IN
            SELECT email
            FROM auth.users
            WHERE email = ANY(emails_to_check)
        LOOP
            RAISE NOTICE '  - %', email_addr.email;
        END LOOP;
    END IF;
    
    RAISE NOTICE '==================';
END $$;

-- Show remaining users count by role (if profiles table exists)
DO $$
DECLARE
    rec RECORD;
    total_users INTEGER;
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
        RAISE NOTICE 'Current user summary by role:';
        FOR rec IN
            SELECT
                COALESCE(p.role, 'no_profile') as role,
                COUNT(*) as user_count
            FROM auth.users u
            LEFT JOIN public.profiles p ON u.id = p.id
            GROUP BY p.role
            ORDER BY p.role
        LOOP
            RAISE NOTICE '  - %: % users', rec.role, rec.user_count;
        END LOOP;
    ELSE
        RAISE NOTICE 'Profiles table does not exist - showing auth users only';
    END IF;
    
    -- Show total remaining users
    SELECT COUNT(*) INTO total_users FROM auth.users;
    RAISE NOTICE 'Total remaining auth users: %', total_users;
END $$;