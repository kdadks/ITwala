-- Migration to add fees_discussed_post_enrollment column to courses table
-- Execute this in Supabase SQL Editor

-- Add the new column to the courses table
ALTER TABLE courses 
ADD COLUMN fees_discussed_post_enrollment BOOLEAN DEFAULT false;

-- Update existing records to have the default value
UPDATE courses 
SET fees_discussed_post_enrollment = false 
WHERE fees_discussed_post_enrollment IS NULL;

-- Verify the column was added successfully
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'courses' 
AND column_name = 'fees_discussed_post_enrollment';

-- Show a sample of the updated table structure
SELECT 
  title,
  fees_discussed_post_enrollment,
  certification_included
FROM courses 
LIMIT 3;