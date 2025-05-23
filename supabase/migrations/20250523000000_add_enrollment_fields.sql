-- Add new columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS highest_qualification TEXT,
ADD COLUMN IF NOT EXISTS has_laptop BOOLEAN DEFAULT false;
