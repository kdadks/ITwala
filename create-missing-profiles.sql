-- Script to manually create missing profiles for users who registered successfully
-- but didn't get a profile created due to trigger issues

-- First, let's see which users don't have profiles
SELECT 
    u.id,
    u.email,
    u.raw_user_meta_data->>'full_name' as full_name,
    u.created_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL
ORDER BY u.created_at DESC;

-- Create profiles for users who don't have them
INSERT INTO public.profiles (id, full_name, avatar_url, created_at, updated_at)
SELECT 
    u.id,
    COALESCE(u.raw_user_meta_data->>'full_name', '') as full_name,
    COALESCE(u.raw_user_meta_data->>'avatar_url', '') as avatar_url,
    u.created_at,
    NOW()
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;

-- Verify the profiles were created
SELECT 
    COUNT(*) as total_users,
    COUNT(p.id) as users_with_profiles,
    COUNT(*) - COUNT(p.id) as users_without_profiles
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id;