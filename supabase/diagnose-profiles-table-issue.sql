-- Diagnostic script to understand why the trigger can't find profiles table

-- Check if profiles table exists and in which schema
SELECT 
    table_schema,
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_name = 'profiles';

-- Check current search_path
SHOW search_path;

-- Check if we can access the profiles table directly
SELECT COUNT(*) as profile_count FROM public.profiles;

-- Check current user and role
SELECT current_user, current_role;

-- Check table permissions
SELECT 
    grantee,
    table_schema,
    table_name,
    privilege_type
FROM information_schema.table_privileges 
WHERE table_name = 'profiles';

-- Check if trigger exists
SELECT 
    trigger_name,
    event_object_schema,
    event_object_table,
    action_timing,
    event_manipulation,
    action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Check if function exists
SELECT 
    routine_schema,
    routine_name,
    routine_type,
    security_type
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';

-- Test if we can manually call the function (this will show the actual error)
-- Note: This is just for testing - don't run this part if you don't want to test
-- SELECT public.handle_new_user();