-- SQL to add 'student' role to Supabase database
-- This version works with TEXT role column (not enum)

-- STEP 1: First, let's check what type the role column is
-- Run this query to see the current structure:
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role';

-- STEP 2: Create function to automatically assign student role on enrollment
-- This version works with TEXT role column
CREATE OR REPLACE FUNCTION assign_student_role_on_enrollment()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user's role to 'student' if they don't already have admin/instructor role
  UPDATE profiles 
  SET role = 'student',
      updated_at = CURRENT_TIMESTAMP
  WHERE id = NEW.user_id 
    AND role = 'user'; -- Only change if currently 'user'
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 3: Create trigger to automatically assign student role when user enrolls
DROP TRIGGER IF EXISTS trigger_assign_student_role ON enrollments;
CREATE TRIGGER trigger_assign_student_role
  AFTER INSERT ON enrollments
  FOR EACH ROW
  EXECUTE FUNCTION assign_student_role_on_enrollment();

-- STEP 4: Create policy for students to access their enrollments
DROP POLICY IF EXISTS "Students can view their own enrollments" ON enrollments;
CREATE POLICY "Students can view their own enrollments"
  ON enrollments FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'instructor')
    )
  );

-- STEP 5 (OPTIONAL): Update existing enrolled users to have student role
-- Uncomment and run this if you want to update existing users who are already enrolled
/*
UPDATE profiles 
SET role = 'student',
    updated_at = CURRENT_TIMESTAMP
WHERE role = 'user' 
  AND id IN (
    SELECT DISTINCT user_id 
    FROM enrollments
  );
*/

-- VERIFICATION QUERIES:
-- Run these to verify everything worked:

-- 1. Check the role column type
SELECT column_name, data_type, character_maximum_length 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name = 'role';

-- 2. Check if function exists
SELECT proname FROM pg_proc WHERE proname = 'assign_student_role_on_enrollment';

-- 3. Check if trigger exists
SELECT tgname FROM pg_trigger WHERE tgname = 'trigger_assign_student_role';

-- 4. Check if policy exists
SELECT policyname FROM pg_policies WHERE tablename = 'enrollments' AND policyname = 'Students can view their own enrollments';

-- 5. Check current role values in profiles table
SELECT DISTINCT role FROM profiles WHERE role IS NOT NULL;