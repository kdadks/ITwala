-- SQL to add 'student' role to Supabase database
-- Execute this in your Supabase SQL editor

-- 1. Add 'student' to the user_role enum
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'student';

-- 2. Create a function to automatically assign student role on enrollment
CREATE OR REPLACE FUNCTION assign_student_role_on_enrollment()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user's role to 'student' if they don't already have admin/instructor role
  UPDATE profiles 
  SET role = 'student'::user_role,
      updated_at = CURRENT_TIMESTAMP
  WHERE id = NEW.user_id 
    AND role = 'user'::user_role; -- Only change if currently 'user'
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create trigger to automatically assign student role when user enrolls
DROP TRIGGER IF EXISTS trigger_assign_student_role ON enrollments;
CREATE TRIGGER trigger_assign_student_role
  AFTER INSERT ON enrollments
  FOR EACH ROW
  EXECUTE FUNCTION assign_student_role_on_enrollment();

-- 4. Create policy for students to access their enrollments
-- Drop existing policy if it exists, then create new one
DROP POLICY IF EXISTS "Students can view their own enrollments" ON enrollments;
CREATE POLICY "Students can view their own enrollments"
  ON enrollments FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin'::user_role, 'instructor'::user_role)
    )
  );

-- 5. Update existing enrolled users to have student role (optional)
-- Uncomment the following lines if you want to update existing users
/*
UPDATE profiles 
SET role = 'student'::user_role,
    updated_at = CURRENT_TIMESTAMP
WHERE role = 'user'::user_role 
  AND id IN (
    SELECT DISTINCT user_id 
    FROM enrollments
  );
*/