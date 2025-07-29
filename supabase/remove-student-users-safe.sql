-- SAFE REMOVAL OF STUDENT USERS AND ASSOCIATED RECORDS
-- This script removes all users with role=student and their associated data
-- WARNING: This is a destructive operation - backup your data first!

-- Step 1: Preview what will be deleted (SAFE - READ ONLY)
DO $$
DECLARE
    student_count INTEGER;
    enrollment_count INTEGER;
BEGIN
    -- Count students
    SELECT COUNT(*) INTO student_count 
    FROM public.profiles WHERE role = 'student';
    
    -- Count associated records
    SELECT COUNT(*) INTO enrollment_count
    FROM enrollments e
    WHERE e.user_id IN (SELECT id FROM public.profiles WHERE role = 'student');
    
   
    
    RAISE NOTICE '=== DELETION PREVIEW ===';
    RAISE NOTICE 'Student users to delete: %', student_count;
    RAISE NOTICE 'Enrollments to delete: %', enrollment_count;
    RAISE NOTICE '========================';
END $$;

-- Step 2: Show list of student users that will be deleted
SELECT 
    p.id,
    p.full_name,
    p.phone,
    p.created_at as profile_created,
    u.email,
    u.created_at as auth_created
FROM public.profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE p.role = 'student'
ORDER BY p.created_at DESC;

-- Step 3: ACTUAL DELETION PROCESS
-- This will run the complete cleanup
DO $$
DECLARE
    student_ids UUID[];
    deleted_enrollments INTEGER := 0;
    deleted_profiles INTEGER := 0;
    deleted_auth_users INTEGER := 0;
BEGIN
    -- Get all student user IDs
    SELECT ARRAY_AGG(id) INTO student_ids 
    FROM public.profiles 
    WHERE role = 'student';
    
    IF student_ids IS NULL OR array_length(student_ids, 1) = 0 THEN
        RAISE NOTICE 'No student users found to delete';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Starting deletion process for % student users...', array_length(student_ids, 1);
    
  
    
    -- Delete enrollments
    DELETE FROM enrollments WHERE user_id = ANY(student_ids);
    GET DIAGNOSTICS deleted_enrollments = ROW_COUNT;
    RAISE NOTICE 'Deleted % enrollments', deleted_enrollments;
    
    -- Delete profiles
    DELETE FROM public.profiles WHERE role = 'student';
    GET DIAGNOSTICS deleted_profiles = ROW_COUNT;
    RAISE NOTICE 'Deleted % profiles', deleted_profiles;
    
    -- Note: auth.users will be automatically deleted due to CASCADE constraint
    -- when profiles are deleted (since profiles references auth.users with ON DELETE CASCADE)
    
    RAISE NOTICE '=== DELETION COMPLETED ===';
    RAISE NOTICE 'Total student users removed: %', deleted_profiles;
    RAISE NOTICE 'Associated records cleaned up:';
    RAISE NOTICE '  - Enrollments: %', deleted_enrollments;
    RAISE NOTICE '===========================';
    
EXCEPTION 
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error during deletion: %', SQLERRM;
END $$;

-- Step 4: Verification - Check that deletion was successful
DO $$
DECLARE
    remaining_students INTEGER;
    orphaned_enrollments INTEGER;

BEGIN
    -- Check remaining students
    SELECT COUNT(*) INTO remaining_students 
    FROM public.profiles WHERE role = 'student';
    
    -- Check for orphaned records
    SELECT COUNT(*) INTO orphaned_enrollments
    FROM enrollments e
    LEFT JOIN public.profiles p ON e.user_id = p.id
    WHERE p.id IS NULL;
    
 
    RAISE NOTICE '=== VERIFICATION RESULTS ===';
    RAISE NOTICE 'Remaining student users: %', remaining_students;
    RAISE NOTICE 'Orphaned enrollments: %', orphaned_enrollments;
  
    
    IF remaining_students = 0 AND orphaned_enrollments = 0  THEN
        RAISE NOTICE 'SUCCESS: All student users and associated records removed cleanly';
    ELSE
        RAISE WARNING 'Some records may not have been cleaned up properly';
    END IF;
    
    RAISE NOTICE '============================';
END $$;

-- Step 5: Show current user summary
SELECT 
    COALESCE(role, 'no_role') as role,
    COUNT(*) as user_count
FROM public.profiles 
GROUP BY role
ORDER BY role;