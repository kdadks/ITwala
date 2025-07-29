-- DESTRUCTIVE OPERATION: Remove all users with role=student and their associated records
-- WARNING: This will permanently delete user data. Use with caution.

-- Step 1: First, let's see what we're about to delete (SAFE - READ ONLY)
SELECT 
    'PREVIEW: Users to be deleted' as action,
    COUNT(*) as student_count
FROM public.profiles 
WHERE role = 'student';

-- Show detailed list of student users
SELECT 
    p.id,
    p.full_name,
    p.phone,
    p.created_at,
    u.email
FROM public.profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE p.role = 'student'
ORDER BY p.created_at DESC;

-- Step 2: Check associated records that will be affected
SELECT 
    'Enrollments to be deleted' as record_type,
    COUNT(*) as count
FROM enrollments e
JOIN public.profiles p ON e.user_id = p.id
WHERE p.role = 'student'

UNION ALL

SELECT 
    'Reviews to be deleted' as record_type,
    COUNT(*) as count
FROM reviews r
JOIN public.profiles p ON r.user_id = p.id
WHERE p.role = 'student'

UNION ALL

SELECT 
    'Progress records to be deleted' as record_type,
    COUNT(*) as count
FROM progress pr
JOIN public.profiles p ON pr.user_id = p.id
WHERE p.role = 'student';

-- Step 3: ACTUAL DELETION (DESTRUCTIVE)
-- Uncomment the sections below ONLY when you're ready to proceed

/*
-- Delete progress records for student users
DELETE FROM progress 
WHERE user_id IN (
    SELECT id FROM public.profiles WHERE role = 'student'
);

-- Delete reviews by student users
DELETE FROM reviews 
WHERE user_id IN (
    SELECT id FROM public.profiles WHERE role = 'student'
);

-- Delete enrollments for student users
DELETE FROM enrollments 
WHERE user_id IN (
    SELECT id FROM public.profiles WHERE role = 'student'
);

-- Delete profiles with student role
DELETE FROM public.profiles 
WHERE role = 'student';

-- Delete auth users (this will cascade and remove the user completely)
-- Note: This requires admin privileges
DELETE FROM auth.users 
WHERE id IN (
    SELECT p.id 
    FROM public.profiles p 
    WHERE p.role = 'student'
);
*/

-- Step 4: Verification (run after deletion to confirm)
/*
SELECT 
    'Remaining student users' as check_type,
    COUNT(*) as count
FROM public.profiles 
WHERE role = 'student';

SELECT 
    'Remaining enrollments for deleted users' as check_type,
    COUNT(*) as count
FROM enrollments e
LEFT JOIN public.profiles p ON e.user_id = p.id
WHERE p.id IS NULL;
*/