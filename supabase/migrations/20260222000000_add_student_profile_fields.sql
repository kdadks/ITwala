-- Add date_of_birth and parent_name fields to profiles table
-- Migration: 20260222000000_add_student_profile_fields.sql

-- Add date_of_birth column (stored as TEXT in DD/MM/YYYY format)
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS date_of_birth TEXT;

-- Add parent_name column
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS parent_name TEXT;

-- Add index for date_of_birth for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_date_of_birth ON profiles(date_of_birth);

-- Add comments for documentation
COMMENT ON COLUMN profiles.date_of_birth IS 'Student date of birth in DD/MM/YYYY format';
COMMENT ON COLUMN profiles.parent_name IS 'Parent or guardian name for student';

-- Grant appropriate permissions
-- These columns should be readable/writable by the profile owner and admins
-- The existing RLS policies should handle this, but we can verify:

-- Note: The existing RLS policies on profiles table already allow:
-- 1. Users to update their own profile
-- 2. Admins to update any profile
-- So no additional policy changes needed for these new columns
