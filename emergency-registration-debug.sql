-- Emergency debug script to understand why users are not being created

-- 1. Check if there are ANY triggers on auth.users table
SELECT 
    trigger_name,
    event_object_schema,
    event_object_table,
    action_timing,
    event_manipulation,
    action_statement,
    action_condition
FROM information_schema.triggers 
WHERE event_object_table = 'users' AND event_object_schema = 'auth';

-- 2. Check if there are any functions that might be interfering
SELECT 
    routine_schema,
    routine_name,
    routine_type,
    security_type,
    routine_definition
FROM information_schema.routines 
WHERE routine_name LIKE '%user%' OR routine_name LIKE '%profile%';

-- 3. Check if auth schema is accessible
SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'auth';

-- 4. Check if we can see auth.users table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'auth' AND table_name = 'users'
ORDER BY ordinal_position;

-- 5. Check current user permissions
SELECT current_user, current_role;

-- 6. Check if there are any policies on auth.users (there shouldn't be but let's check)
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'users' AND schemaname = 'auth';

-- 7. Check for any hooks or extensions that might interfere
SELECT * FROM pg_extension WHERE extname LIKE '%auth%' OR extname LIKE '%supabase%';

-- 8. Check current transaction isolation level
SHOW transaction_isolation;

-- 9. Check if there are any active connections or locks
SELECT 
    pid,
    usename,
    application_name,
    client_addr,
    state,
    query
FROM pg_stat_activity 
WHERE datname = current_database()
AND state = 'active'
AND query NOT LIKE '%pg_stat_activity%';