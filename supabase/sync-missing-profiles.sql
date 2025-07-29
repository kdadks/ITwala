-- Script to sync missing profiles from auth.users to profiles table
-- This fixes the issue where users exist in auth.users but not in profiles

-- STEP 1: Create missing profiles for users that don't have them
INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'full_name', au.email) as full_name,
    CASE 
        WHEN au.email = 'admin@itwala.com' THEN 'admin'
        WHEN au.raw_user_meta_data->>'role' = 'admin' THEN 'admin'
        ELSE 'student'
    END as role,
    au.created_at,
    CURRENT_TIMESTAMP as updated_at
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE p.id IS NULL -- Only insert where profile doesn't exist
AND au.email_confirmed_at IS NOT NULL; -- Only for confirmed users

-- STEP 2: Update any existing profiles that have NULL or empty roles
UPDATE profiles 
SET role = 'student',
    updated_at = CURRENT_TIMESTAMP
WHERE role IS NULL 
   OR role = '' 
   OR role = 'user';

-- STEP 3: Ensure admin role is set correctly
UPDATE profiles 
SET role = 'admin',
    updated_at = CURRENT_TIMESTAMP
WHERE email = 'admin@itwala.com';

-- STEP 4: Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION create_profile_on_signup()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        CASE 
            WHEN NEW.email = 'admin@itwala.com' THEN 'admin'
            WHEN NEW.raw_user_meta_data->>'role' = 'admin' THEN 'admin'
            ELSE 'student'
        END,
        NEW.created_at,
        CURRENT_TIMESTAMP
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 5: Create trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS trigger_create_profile_on_signup ON auth.users;
CREATE TRIGGER trigger_create_profile_on_signup
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_profile_on_signup();

-- VERIFICATION QUERIES:
-- Check if all users have profiles
SELECT 
    'Users without profiles' as check_type,
    COUNT(*) as count
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE p.id IS NULL
    AND au.email_confirmed_at IS NOT NULL

UNION ALL

SELECT 
    'Total confirmed users' as check_type,
    COUNT(*) as count
FROM auth.users 
WHERE email_confirmed_at IS NOT NULL

UNION ALL

SELECT 
    'Total profiles' as check_type,
    COUNT(*) as count
FROM profiles

UNION ALL

SELECT 
    'Profiles by role' as check_type,
    COUNT(*) as count
FROM profiles
GROUP BY role;

-- Check for any remaining NULL roles
SELECT 
    'Profiles with NULL roles' as check_type,
    COUNT(*) as count
FROM profiles 
WHERE role IS NULL OR role = '';