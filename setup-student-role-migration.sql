-- Complete SQL Migration Script for Student Role Implementation
-- This script handles both TEXT and ENUM role columns

-- STEP 1: Check current role column type and update accordingly
DO $$
DECLARE
    role_type TEXT;
BEGIN
    -- Check if role column is an enum or text
    SELECT data_type INTO role_type
    FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'role';
    
    IF role_type = 'USER-DEFINED' THEN
        -- It's an enum, add 'student' value
        RAISE NOTICE 'Role column is enum type, adding student value...';
        ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'student';
    ELSE
        -- It's text, no need to modify
        RAISE NOTICE 'Role column is text type, no enum modification needed';
    END IF;
END $$;

-- STEP 2: Create function to automatically assign student role on enrollment
CREATE OR REPLACE FUNCTION assign_student_role_on_enrollment()
RETURNS TRIGGER AS $$
BEGIN
    -- Update user's role to 'student' if they don't already have admin/instructor role
    UPDATE profiles 
    SET role = 'student',
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.user_id 
      AND role IN ('user', 'student'); -- Change from 'user' to 'student' or keep as 'student'
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 3: Create trigger to automatically assign student role when user enrolls
DROP TRIGGER IF EXISTS trigger_assign_student_role ON enrollments;
CREATE TRIGGER trigger_assign_student_role
    AFTER INSERT ON enrollments
    FOR EACH ROW
    EXECUTE FUNCTION assign_student_role_on_enrollment();

-- STEP 4: Update existing policies to include 'student' role
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

-- STEP 5: Create policy for students to view courses they're enrolled in
DROP POLICY IF EXISTS "Students can view courses they're enrolled in" ON courses;
CREATE POLICY "Students can view courses they're enrolled in"
    ON courses FOR SELECT
    USING (
        true OR -- All users can view courses
        EXISTS (
            SELECT 1 FROM enrollments
            WHERE enrollments.course_id = courses.id
            AND enrollments.user_id = auth.uid()
        )
    );

-- STEP 6: Update existing users with 'user' role to 'student' if they are enrolled
UPDATE profiles 
SET role = 'student',
    updated_at = CURRENT_TIMESTAMP
WHERE role = 'user' 
  AND id IN (
    SELECT DISTINCT user_id 
    FROM enrollments
    WHERE status = 'active'
  );

-- STEP 7: Update any remaining 'user' roles to 'student' (default for new signups)
UPDATE profiles 
SET role = 'student',
    updated_at = CURRENT_TIMESTAMP
WHERE role = 'user' 
  AND id NOT IN (
    SELECT id FROM profiles WHERE role IN ('admin', 'instructor')
  );

-- STEP 8: Update profiles table to ensure updated_at column exists
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- STEP 9: Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- STEP 10: Create trigger for updated_at on profiles
DROP TRIGGER IF EXISTS trigger_update_profiles_updated_at ON profiles;
CREATE TRIGGER trigger_update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- VERIFICATION QUERIES:
-- Uncomment and run these to verify everything worked:

-- 1. Check the role column type
-- SELECT column_name, data_type, character_maximum_length 
-- FROM information_schema.columns 
-- WHERE table_name = 'profiles' AND column_name = 'role';

-- 2. Check current role distribution
-- SELECT role, COUNT(*) as count FROM profiles GROUP BY role;

-- 3. Check if function exists
-- SELECT proname FROM pg_proc WHERE proname = 'assign_student_role_on_enrollment';

-- 4. Check if trigger exists
-- SELECT tgname FROM pg_trigger WHERE tgname = 'trigger_assign_student_role';

-- 5. Check if policies exist
-- SELECT policyname FROM pg_policies WHERE tablename = 'enrollments';

-- 6. Test enrollment trigger (replace with actual user_id and course_id)
-- INSERT INTO enrollments (user_id, course_id, status) VALUES ('your-user-id', 'your-course-id', 'active');
-- SELECT role FROM profiles WHERE id = 'your-user-id';

COMMIT;